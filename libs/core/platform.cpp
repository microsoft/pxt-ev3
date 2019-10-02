#include "pxt.h"

#include <unistd.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <pthread.h>
#include <signal.h>
#include <dirent.h>
#include "ev3const.h"

namespace pxt {

    static int usbFD;

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

static void *exitThread(void *) {
    int fd = open("/dev/lms_ui", O_RDWR, 0666);
    if (fd < 0)
        return 0;
    uint8_t *data =
        (uint8_t *)mmap(NULL, NUM_BUTTONS, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (data == MAP_FAILED) {
        close(fd);
        return 0;
    }
    for (;;) {
        if (data[5])
            target_reset();
        sleep_core_us(50000);
    }
}

static void startExitThread() {
    pthread_t pid;
    pthread_create(&pid, NULL, exitThread, NULL);
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
    uint8_t cmd[3] = {opOutputStop, 0x0F, 0};
    int fd = open("/dev/lms_pwm", O_RDWR);
    write(fd, cmd, 3);
    close(fd);
}

void stopProgram() {
    uint8_t cmd[1] = {opOutputProgramStop};
    int fd = open("/dev/lms_pwm", O_RDWR);
    write(fd, cmd, 1);
    close(fd);
}

extern "C" void target_reset() {
    stopMotors();
    stopProgram();
    if (lmsPid)
        runLMS();
    else
        exit(0);
}

void target_exit() {
    target_reset();
}


void target_startup() {
    stopLMS();
    startUsb();
    startExitThread();
}

void initKeys() {}


}
