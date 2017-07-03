#include "pxt.h"

#include <stdlib.h>
#include <stdio.h>
#include <sys/time.h>
#include <time.h>
#include <cstdarg>
#include <pthread.h>
#include <assert.h>
#include <map>

#define DEVICE_EVT_ANY 0

void dmesg(const char *format, ...) {
    char buf[500];

    va_list arg;
    va_start(arg, format);
    vsnprintf(buf, sizeof(buf), format, arg);
    va_end(arg);

    fprintf(stderr, "DMESG: %s\n", buf);
}

namespace pxt {

static int startTime;
static std::map<std::pair<int, int>, Action> handlersMap;

static pthread_mutex_t execMutex;
static pthread_t execThread;
static pthread_cond_t newEventBroadcast;
static pthread_mutex_t newEventMutex;

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
    fwrite(data, 1, len, stderr);
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

void checkUserMode() {
    assert(execThread == pthread_self());
}

void startUser() {
    assert(execThread != pthread_self());
    pthread_mutex_lock(&execMutex);
    execThread = pthread_self();
}

void stopUser() {
    assert(execThread == pthread_self());
    execThread = 0;
    pthread_mutex_unlock(&execMutex);
}

void sleep_ms(uint32_t ms) {
    stopUser();

    struct timespec ts;
    ts.tv_sec = ms / 1000;
    ts.tv_nsec = (ms % 1000) * 1000000;
    while (nanosleep(&ts, &ts))
        ;

    startUser();
}

void sleep_us(uint64_t us) {
    checkUserMode();

    if (us > 10000) {
        sleep_ms(us / 1000);
    }
    struct timespec ts;
    ts.tv_sec = us / 1000000;
    ts.tv_nsec = (us % 1000000) * 1000;
    while (nanosleep(&ts, &ts))
        ;
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
            t->waitSource = source;
            t->waitValue = value;
            stopUser();
            // spourious wake ups may occur they say
            while (t->waitSource) {
                pthread_mutex_lock(&newEventMutex);
                pthread_cond_wait(&t->waitCond, &newEventMutex);
            }
            startUser();
            return;
        }
    }
    assert(0);
}

static void dispatchEvent(Event &e) {
    lastEvent = e;

    Action curr = handlersMap[{e.source, e.value}];
    if (curr)
        setupThread(curr, fromInt(e.value));

    curr = handlersMap[{e.source, DEVICE_EVT_ANY}];
    if (curr)
        setupThread(curr, fromInt(e.value));
}

static void *evtDispatcher(void *dummy) {
    pthread_mutex_lock(&newEventMutex);
    while (true) {
        pthread_cond_wait(&newEventBroadcast, &newEventMutex);
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
    checkUserMode();
    auto e = mkEvent(id, event);
    pthread_mutex_lock(&newEventMutex);
    if (eventTail == NULL) {
        assert(eventHead == NULL);
        eventHead = eventTail = e;
    } else {
        eventTail->next = e;
        eventTail = e;
    }
    pthread_cond_broadcast(&newEventBroadcast);
    pthread_mutex_unlock(&newEventMutex);
}

void registerWithDal(int id, int event, Action a) {
    Action prev = handlersMap[{id, event}];
    if (prev)
        decr(prev);
    else {
        // first time processing?
    }
    incr(a);
    handlersMap[{id, event}] = a;
}

uint32_t afterProgramPage() {
    return 0;
}
void dumpDmesg() {
    // TODO
}

void initRuntime() {
    startTime = currTime();
    pthread_t disp;
    pthread_create(&disp, NULL, evtDispatcher, NULL);
    pthread_detach(disp);
}
}
