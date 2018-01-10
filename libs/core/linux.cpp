#include "pxt.h"

#include <stdlib.h>
#include <stdio.h>
#include <sys/time.h>
#include <time.h>
#include <cstdarg>
#include <pthread.h>
#include <unistd.h>
#include <dirent.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <errno.h>
#include <fcntl.h>
#include <malloc.h>

#define THREAD_DBG(...)

#define MALLOC_LIMIT (8 * 1024 * 1024)
#define MALLOC_CHECK_PERIOD (1024 * 1024)

void *xmalloc(size_t sz) {
    static size_t allocBytes = 0;
    allocBytes += sz;
    if (allocBytes >= MALLOC_CHECK_PERIOD) {
        allocBytes = 0;
        auto info = mallinfo();
        DMESG("malloc used: %d kb", info.uordblks / 1024);
        if (info.uordblks > MALLOC_LIMIT) {
            target_panic(904);
        }
    }
    auto r = malloc(sz);
    if (r == NULL)
        target_panic(905); // shouldn't happen
    return r;
}

void *operator new(size_t size) {
    return xmalloc(size);
}
void *operator new[](size_t size) {
    return xmalloc(size);
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

struct Thread {
    struct Thread *next;
    Action act;
    TValue arg0;
    pthread_t pid;
    pthread_cond_t waitCond;
    int waitSource;
    int waitValue;
    TValue data0;
    TValue data1;
};

static struct Thread *allThreads;
static struct Event *eventHead, *eventTail;
static int usbFD;
static int dmesgPtr;
static int dmesgSerialPtr;
static char dmesgBuf[4096];

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

#define USB_MAGIC 0x3d3f
#define USB_SERIAL 1
#define USB_RESTART 2
#define USB_DMESG 3

struct UsbPacket {
    uint16_t size;
    uint16_t msgcount;
    uint16_t magic;
    uint16_t code;
    char buf[1024 - 8];
};

void *usbThread(void *) {
    UsbPacket pkt;
    UsbPacket resp;
    while (true) {
        int len = read(usbFD, &pkt, sizeof(pkt));
        if (len <= 4) {
            sleep_core_us(20000);
            continue;
        }
        resp.msgcount = pkt.msgcount;
        if (pkt.magic == USB_MAGIC) {
            if (pkt.code == USB_RESTART) {
                target_reset();
            } else if (pkt.code == USB_DMESG) {
                dumpDmesg();
            }
            /*
            resp.magic = pkt.magic;
            resp.code = pkt.code;
            resp.size = 8;
            write(usbFD, &resp, sizeof(resp));
            */
        } else {
            resp.magic = 0xffff;
            resp.size = 4;
            write(usbFD, &resp, sizeof(resp));
        }
        sleep_core_us(1000);
    }
}

static void startUsb() {
    usbFD = open("/dev/lms_usbdev", O_RDWR, 0666);
    pthread_t pid;
    pthread_create(&pid, NULL, usbThread, NULL);
    pthread_detach(pid);
}

void sendUsb(uint16_t code, const char *data, int len) {
    while (len > 0) {
        int sz = len;
        if (sz > 1000)
            sz = 1000;
        UsbPacket pkt = {(uint16_t)(6 + sz), 0, USB_MAGIC, code, {}};
        memcpy(pkt.buf, data, sz);
        write(usbFD, &pkt, sizeof(pkt));
        len -= sz;
        data += sz;
    }
}

void sendSerial(const char *data, int len) {
    sendUsb(USB_SERIAL, data, len);
}

volatile bool paniced;
extern "C" void drawPanic(int code);

extern "C" void target_panic(int error_code) {
    char buf[50];
    paniced = true;
    pthread_mutex_trylock(&execMutex);

    snprintf(buf, sizeof(buf), "\nPANIC %d\n", error_code);

    drawPanic(error_code);
    DMESG("PANIC %d", error_code);

    for (int i = 0; i < 10; ++i) {
        sendSerial(buf, strlen(buf));
        sleep_core_us(500 * 1000);
    }

    target_reset();
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
    decr(t->arg0);
    decr(t->data0);
    decr(t->data1);
    pthread_cond_destroy(&t->waitCond);
    delete t;
}

static void runAct(Thread *thr) {
    startUser();
    pxt::runAction1(thr->act, thr->arg0);
    stopUser();
    disposeThread(thr);
}

static void mainThread(Thread *) {}

void setupThread(Action a, TValue arg = 0, void (*runner)(Thread *) = NULL, TValue d0 = 0,
                 TValue d1 = 0) {
    if (runner == NULL)
        runner = runAct;
    auto thr = new Thread();
    memset(thr, 0, sizeof(Thread));
    thr->next = allThreads;
    allThreads = thr;
    thr->act = incr(a);
    thr->arg0 = incr(arg);
    thr->data0 = incr(d0);
    thr->data1 = incr(d1);
    pthread_cond_init(&thr->waitCond, NULL);
    if (runner == mainThread) {
        thr->pid = pthread_self();
    } else {
        pthread_create(&thr->pid, NULL, (void *(*)(void *))runner, thr);
        THREAD_DBG("setup thread: %p (pid %p)", thr, thr->pid);
        pthread_detach(thr->pid);
    }
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
    THREAD_DBG("waitForEv: %d %d", source, value);
    auto self = pthread_self();
    for (auto t = allThreads; t; t = t->next) {
        THREAD_DBG("t: %p", t);
        if (t->pid == self) {
            pthread_mutex_lock(&eventMutex);
            t->waitSource = source;
            t->waitValue = value;
            stopUser();
            // spourious wake ups may occur they say
            while (t->waitSource) {
                pthread_cond_wait(&t->waitCond, &eventMutex);
            }
            pthread_mutex_unlock(&eventMutex);
            startUser();
            return;
        }
    }
    DMESG("current thread not registered!");
    target_panic(901);
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
            if (paniced)
                return 0;
            Event *ev = eventHead;
            eventHead = ev->next;
            if (eventHead == NULL)
                eventTail = NULL;

            for (auto thr = allThreads; thr; thr = thr->next) {
                if (paniced)
                    return 0;
                if (thr->waitSource == 0)
                    continue;
                if (thr->waitValue != ev->value && thr->waitValue != DEVICE_EVT_ANY)
                    continue;
                if (thr->waitSource == ev->source) {
                    thr->waitSource = 0; // once!
                    pthread_cond_broadcast(&thr->waitCond);
                } else if (thr->waitSource == DEVICE_ID_NOTIFY &&
                           ev->source == DEVICE_ID_NOTIFY_ONE) {
                    thr->waitSource = 0; // once!
                    pthread_cond_broadcast(&thr->waitCond);
                    break; // do not wake up any other threads
                }
            }

            dispatchEvent(*ev);
            delete ev;
        }
    }
}

int allocateNotifyEvent() {
    static volatile int notifyId;
    pthread_mutex_lock(&eventMutex);
    int res = ++notifyId;
    pthread_mutex_unlock(&eventMutex);
    return res;
}

void raiseEvent(int id, int event) {
    auto e = mkEvent(id, event);
    pthread_mutex_lock(&eventMutex);
    if (eventTail == NULL) {
        if (eventHead != NULL)
            target_panic(902);
        eventHead = eventTail = e;
    } else {
        eventTail->next = e;
        eventTail = e;
    }
    pthread_cond_broadcast(&newEventBroadcast);
    pthread_mutex_unlock(&eventMutex);
}

void registerWithDal(int id, int event, Action a, int flags) {
    // TODO support flags
    setBinding(id, event, a);
}

static void runPoller(Thread *thr) {
    Action query = thr->data0;
    auto us = (uint64_t)toInt(thr->data1) * 1000;

    // note that this is run without the user mutex held - it should not modify any state!
    TValue prev = pxt::runAction0(query);

    startUser();
    pxt::runAction2(thr->act, prev, prev);
    stopUser();

    while (true) {
        sleep_core_us(us);
        if (paniced)
            break;
        TValue curr = pxt::runAction0(query);
        if (curr != prev) {
            startUser();
            pxt::runAction2(thr->act, prev, curr);
            stopUser();
            if (paniced)
                break;
            decr(prev);
            prev = curr;
        }
    }
    //    disposeThread(thr);
}

//%
void unsafePollForChanges(int ms, Action query, Action handler) {
    setupThread(handler, 0, runPoller, query, fromInt(ms));
}

uint32_t afterProgramPage() {
    return 0;
}
void dumpDmesg() {
    auto len = dmesgPtr - dmesgSerialPtr;
    if (len == 0)
        return;
    sendSerial(dmesgBuf + dmesgSerialPtr, len);
    dmesgSerialPtr = dmesgPtr;
}

int lmsPid;
void stopLMS() {
    struct dirent *ent;
    DIR *dir;

    dir = opendir("/proc");
    if (dir == NULL)
        return;

    while ((ent = readdir(dir)) != NULL) {
        int pid = atoi(ent->d_name);
        if (!pid)
            continue;
        char namebuf[100];
        snprintf(namebuf, 1000, "/proc/%d/cmdline", pid);
        FILE *f = fopen(namebuf, "r");
        if (f) {
            fread(namebuf, 1, 99, f);
            if (strcmp(namebuf, "./lms2012") == 0) {
                lmsPid = pid;
            }
            fclose(f);
            if (lmsPid)
                break;
        }
    }

    closedir(dir);

    lmsPid = 0; // disable SIGSTOP for now - rethink if problems with I2C (runs on a thread)

    if (lmsPid) {
        DMESG("SIGSTOP to lmsPID=%d", lmsPid);
        if (kill(lmsPid, SIGSTOP))
            DMESG("SIGSTOP failed");
    }
}

void runLMS() {
    DMESG("re-starting LMS2012");
    kill(lmsPid, SIGCONT);
    sleep_core_us(200000);
    exit(0);
    /*
    chdir("/home/root/lms2012/sys");
    for (int fd = 3; fd < 9999; ++fd)
        close(fd);
    execl("lms2012", "./lms2012");
    exit(100); // should not be reached
    */
}

void stopMotors() {
    uint8_t cmd[2] = { 0xA3, 0x0F };
    int fd = open("/dev/lms_pwm", O_RDWR);
    write(fd, cmd, 2);
    close(fd);
}

extern "C" void target_reset() {
    stopMotors();
    if (lmsPid)
        runLMS();
    else
        exit(0);
}

void screen_init();
void initRuntime() {
    // daemon(1, 1);
    startTime = currTime();
    DMESG("runtime starting...");
    stopLMS();
    startUsb();
    pthread_t disp;
    pthread_create(&disp, NULL, evtDispatcher, NULL);
    pthread_detach(disp);
    setupThread(0, 0, mainThread);
    target_init();
    screen_init();
    startUser();
}

static FILE *dmesgFile;

void dmesgRaw(const char *buf, uint32_t len) {
    if (!dmesgFile) {
        dmesgFile = fopen("/tmp/dmesg.txt", "w");
        if (!dmesgFile)
            dmesgFile = stderr;
    }

    if (len > sizeof(dmesgBuf) / 2)
        return;
    if (dmesgPtr + len > sizeof(dmesgBuf)) {
        dmesgPtr = 0;
        dmesgSerialPtr = 0;
    }
    memcpy(dmesgBuf + dmesgPtr, buf, len);
    dmesgPtr += len;
    fwrite(buf, 1, len, dmesgFile);
}

void dmesg(const char *format, ...) {
    char buf[500];

    snprintf(buf, sizeof(buf), "[%8d] ", current_time_ms());
    dmesgRaw(buf, strlen(buf));

    va_list arg;
    va_start(arg, format);
    vsnprintf(buf, sizeof(buf), format, arg);
    va_end(arg);
    dmesgRaw(buf, strlen(buf));
    dmesgRaw("\n", 1);

    fflush(dmesgFile);
    fdatasync(fileno(dmesgFile));
}
} // namespace pxt
