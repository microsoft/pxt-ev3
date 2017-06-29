#include "pxt.h"

#include <stdlib.h>
#include <stdio.h>
#include <sys/time.h>
#include <time.h>

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

void sleep_us(uint64_t us) {
    struct timespec ts;
    ts.tv_sec = us / 1000000;
    ts.tv_nsec = (us % 1000000) * 1000;
    while (nanosleep(&ts, &ts))
        ;
}

void sleep_ms(uint32_t ms) {
    sleep_us((uint64_t)ms * 1000);
}

uint64_t currTime() {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec * 1000 + tv.tv_usec / 1000;
}

static int startTime;

void initRuntime() {
    startTime = currTime();
}

int current_time_ms() {
    return currTime() - startTime;
}

int getSerialNumber() {
    return 42; // TODO
}

void registerWithDal(int id, int event, Action a) {
    // TODO
}
void runInBackground(Action a) {
    // TODO
}
void runForever(Action a) {
    // TODO
}
void waitForEvent(int id, int event) {
    // TODO
}

uint32_t afterProgramPage() {
    return 0;
}
void dumpDmesg() {
    // TODO
}

}
