#include "pxt.h"

#include <stdlib.h>
#include <stdio.h>
#include <sys/time.h>
#include <time.h>
#include <cstdarg>

#include <pth.h>

// TODO set JOINABLE to false

static int startTime;
static map<pair<int, int>, Action> handlersMap;
static pth_msgport_t evMsgPort;

struct Thread {
    struct Thread *next;
    Action act;
    TValue arg0;
    pth_t pid;
    pth_msgport_t waitEventPort;
    int waitSource;
    int waitValue;
};

static struct Thread *allThreads;

struct Event {
    pth_message_t msg;
    int source;
    int value;
};

Event *mkEvent(int source, int value) {
    auto res = new Event();
    memset(res, 0, sizeof(Event));
    res->source = source;
    res->value = value;
    return res;
}

void dmesg(const char *format, ...) {
    char buf[500];

    va_list arg;
    va_start(arg, format);
    vsnprintf(buf, sizeof(buf), format, arg);
    va_end(arg);

    fprintf(stderr, "DMESG: %s\n", buf);
}

namespace pxt {

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

void sleep_ms(uint32_t ms) {
    struct timeval tv;
    tv.tv_sec = ms / 1000;
    tv.tv_usec = (ms % 1000) * 1000;
    pth_nap(tv);
}

void sleep_us(uint64_t us) {
    if (us > 20000) {
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
    pth_msgport_destroy(t->waitEventPort);
    delete t;
}

static void runAct(Thread *thr) {
    pxt::runAction1(thr->act, thr->arg0);
    disposeThread(thr);
}

void setupThread(Action a, TValue arg = 0, void (*runner)(Thread *) = runAct) {
    auto thr = new Thread();
    memset(thr, 0, sizeof(Thread));
    thr->next = allThreads;
    allThreads = thr;
    thr->act = a;
    thr->arg0 = a;
    thr->waitEventPort = pth_msgport_create(NULL);
    incr(a);
    pth_spawn(PTH_ATTR_DEFAULT, runner, thr);
}

void runInBackground(Action a) {
    setupThread(a);
}

static void runFor(Thread *t) {
    while (true) {
        pxt::runAction0(t->act);
        sleep_ms(20);
    }
}

void runForever(Action a) {
    setupThread(a, 0, runFor);
}

void waitForEvent(int id, int event) {
    // TODO
}

static void dispatchEvent(Event &e) {
    // lastEvent = e;

    Action curr = handlersMap[{e.source, e.value}];
    if (curr)
        runAction1(curr, fromInt(e.value));

    curr = handlersMap[{e.source, DEVICE_EVT_ANY}];
    if (curr)
        runAction1(curr, fromInt(e.value));
}

static void *evtDispatcher(void *dummy) {
    pth_event_t msgEv = pth_event(PTH_EVENT_MSG, evMsgPort);
    Event *ev;
    while (true) {
        pth_wait(msgEv);
        while (NULL != (ev = (Event *)pth_msgport_get(evMsgPort))) {
            for (auto thr = allThreads; thr; thr = thr->next) {
                if (thr->waitSource == ev->source &&
                    (thr->waitValue == ev->value || thr->waitValue == DEVICE_EVT_ANY)) {
                    Event *copy = mkEvent(ev->source, ev->value);
                    pth_msgport_put(thr->waitEventPort, copy);
                    thr->waitSource = 0; // once!
                }
            }
            dispatchEvent(*ev);
            delete ev;
        }
    }
}

void raiseEvent(int id, int event) {
    auto e = mkEvent(id, event);
    pth_msgport_put(evMsgPort, e);
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
    pth_init();
}
}
