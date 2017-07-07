#include "pxt.h"

#include <stdlib.h>
#include <stdio.h>
#include <sys/time.h>
#include <time.h>
#include <cstdarg>
#include <pthread.h>
#include <assert.h>
#include <unistd.h>

#define DEVICE_EVT_ANY 0

void *operator new(size_t size) {
    return malloc(size);
}
void *operator new[](size_t size) {
    return malloc(size);
}

void operator delete(void *p) {
    free(p);
}
void operator delete[](void *p) {
    free(p);
}

namespace pxt {

static int startTime;
static pthread_mutex_t execMutex;
static pthread_mutex_t eventMutex;
static pthread_cond_t newEventBroadcast;
static FILE *dmesgFile;
static FILE *serialFile;

struct Thread {
    struct Thread *next;
    Action act;
    TValue arg0;
    pthread_t pid;
    pthread_cond_t waitCond;
    int waitSource;
    int waitValue;
};

static struct Thread *allThreads;
static struct Event *eventHead, *eventTail;

struct Event {
    struct Event *next;
    int source;
    int value;
};

Event lastEvent;

Event *mkEvent(int source, int value) {
    auto res = new Event();
    memset(res, 0, sizeof(Event));
    res->source = source;
    res->value = value;
    return res;
}

void sendSerial(const char *data, int len) {
    if (!serialFile) {
        serialFile = fopen("/tmp/serial.txt", "w");
        if (!serialFile)
            serialFile = stderr;
    }

    fwrite(data, 1, len, serialFile);
    fflush(serialFile);
    fdatasync(fileno(serialFile));
}

extern "C" void target_panic(int error_code) {
    char buf[50];
    snprintf(buf, sizeof(buf), "\nPANIC %d\n", error_code);
    sendSerial(buf, strlen(buf));
    abort();
}

extern "C" void target_reset() {
    exit(0);
}

void startUser() {
    pthread_mutex_lock(&execMutex);
}

void stopUser() {
    pthread_mutex_unlock(&execMutex);
}

void sleep_core_us(uint64_t us) {
    struct timespec ts;
    ts.tv_sec = us / 1000000;
    ts.tv_nsec = (us % 1000000) * 1000;
    while (nanosleep(&ts, &ts))
        ;
}

void sleep_ms(uint32_t ms) {
    stopUser();
    sleep_core_us(ms * 1000);
    startUser();
}

void sleep_us(uint64_t us) {
    if (us > 50000) {
        sleep_ms(us / 1000);
    }
    sleep_core_us(us);
}

uint64_t currTime() {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec * 1000 + tv.tv_usec / 1000;
}

int current_time_ms() {
    return currTime() - startTime;
}

int getSerialNumber() {
    return 42; // TODO
}

void disposeThread(Thread *t) {
    if (allThreads == t) {
        allThreads = t->next;
    } else {
        for (auto tt = allThreads; tt; tt = tt->next) {
            if (tt->next == t) {
                tt->next = t->next;
                break;
            }
        }
    }
    decr(t->act);
    pthread_cond_destroy(&t->waitCond);
    delete t;
}

static void runAct(Thread *thr) {
    startUser();
    pxt::runAction1(thr->act, thr->arg0);
    stopUser();
    disposeThread(thr);
}

void setupThread(Action a, TValue arg = 0, void (*runner)(Thread *) = NULL) {
    if (runner == NULL)
        runner = runAct;
    auto thr = new Thread();
    memset(thr, 0, sizeof(Thread));
    thr->next = allThreads;
    allThreads = thr;
    thr->act = a;
    thr->arg0 = a;
    pthread_cond_init(&thr->waitCond, NULL);
    incr(a);
    pthread_create(&thr->pid, NULL, (void *(*)(void *))runner, thr);
    pthread_detach(thr->pid);
}

void runInBackground(Action a) {
    setupThread(a);
}

static void runFor(Thread *t) {
    startUser();
    while (true) {
        pxt::runAction0(t->act);
        sleep_ms(20);
    }
}

void runForever(Action a) {
    setupThread(a, 0, runFor);
}

void waitForEvent(int source, int value) {
    auto self = pthread_self();
    for (auto t = allThreads; t; t = t->next) {
        if (t->pid == self) {
            pthread_mutex_lock(&eventMutex);
            t->waitSource = source;
            t->waitValue = value;
            // spourious wake ups may occur they say
            while (t->waitSource) {
                pthread_cond_wait(&t->waitCond, &eventMutex);
            }
            pthread_mutex_unlock(&eventMutex);
            return;
        }
    }
    assert(0);
}

static void dispatchEvent(Event &e) {
    lastEvent = e;

    auto curr = findBinding(e.source, e.value);
    if (curr)
        setupThread(curr->action, fromInt(e.value));

    curr = findBinding(e.source, DEVICE_EVT_ANY);
    if (curr)
        setupThread(curr->action, fromInt(e.value));
}

static void *evtDispatcher(void *dummy) {
    pthread_mutex_lock(&eventMutex);
    while (true) {
        pthread_cond_wait(&newEventBroadcast, &eventMutex);
        while (eventHead != NULL) {
            Event *ev = eventHead;
            eventHead = ev->next;
            if (eventHead == NULL)
                eventTail = NULL;

            for (auto thr = allThreads; thr; thr = thr->next) {
                if (thr->waitSource == ev->source &&
                    (thr->waitValue == ev->value || thr->waitValue == DEVICE_EVT_ANY)) {
                    thr->waitSource = 0; // once!
                    pthread_cond_broadcast(&thr->waitCond);
                }
            }

            dispatchEvent(*ev);
            delete ev;
        }
    }
}

void raiseEvent(int id, int event) {
    auto e = mkEvent(id, event);
    pthread_mutex_lock(&eventMutex);
    if (eventTail == NULL) {
        assert(eventHead == NULL);
        eventHead = eventTail = e;
    } else {
        eventTail->next = e;
        eventTail = e;
    }
    pthread_cond_broadcast(&newEventBroadcast);
    pthread_mutex_unlock(&eventMutex);
}

void registerWithDal(int id, int event, Action a) {
    setBinding(id, event, a);
}

uint32_t afterProgramPage() {
    return 0;
}
void dumpDmesg() {
    // TODO
}

void screen_init();
void initRuntime() {
    daemon(1, 1);
    startTime = currTime();
    DMESG("runtime starting...");
    pthread_t disp;
    pthread_create(&disp, NULL, evtDispatcher, NULL);
    pthread_detach(disp);
    target_init();
    screen_init();
    startUser();
}

void dmesg(const char *format, ...) {
    char buf[500];

    if (!dmesgFile) {
        dmesgFile = fopen("/tmp/dmesg.txt", "w");
        if (!dmesgFile)
            dmesgFile = stderr;
    }

    va_list arg;
    va_start(arg, format);
    vsnprintf(buf, sizeof(buf), format, arg);
    va_end(arg);

    fprintf(dmesgFile, "[%8d] %s\n", current_time_ms(), buf);
    fflush(dmesgFile);
    fdatasync(fileno(dmesgFile));
}

}
