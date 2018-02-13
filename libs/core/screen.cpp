#include "pxt.h"
#include "ev3const.h"
#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/mman.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <sys/ioctl.h>

#define XX(v) ((uint32_t)(v)&0xffff)
#define YY(v) ((uint32_t)(v) >> 16)

// We only support up to 4 arguments for C++ functions - need to pack them on the TS side
namespace screen {

#define ROW_SIZE 23
#define FB_SIZE (60 * LCD_HEIGHT)

static const uint8_t pixmap[] = {0x00, 0xE0, 0x1C, 0xFC, 0x03, 0xE3, 0x1F, 0xFF};

static uint8_t revbits(uint8_t v) {
    v = (v & 0xf0) >> 4 | (v & 0x0f) << 4;
    v = (v & 0xcc) >> 2 | (v & 0x33) << 2;
    v = (v & 0xaa) >> 1 | (v & 0x55) << 1;
    return v;
}

static void bitBufferToFrameBuffer(uint8_t *bitBuffer, uint8_t *fb) {
    uint32_t pixels;

    // TODO remove revbits() calls

    for (int line = 0; line < LCD_HEIGHT; line++) {
        int n = 7;
        while (n--) {
            pixels = revbits(*bitBuffer++) << 0;
            pixels |= revbits(*bitBuffer++) << 8;
            pixels |= revbits(*bitBuffer++) << 16;

            int m = 8;
            while (m--) {
                *fb++ = pixmap[pixels & 0x07];
                pixels >>= 3;
            }
        }

        pixels = revbits(*bitBuffer++) << 0;
        pixels |= revbits(*bitBuffer++) << 8;

        int m = 4;
        while (m--) {
            *fb++ = pixmap[pixels & 0x07];
            pixels >>= 3;
        }
    }
}

static uint8_t *mappedFrameBuffer;
static Image lastImg;

//%
void updateLCD(Image img) {
    if (dirty && mappedFrameBuffer != MAP_FAILED) {
        dirty = false;
        if (img && img != lastImg) {
            decrRC(lastImg);
            incrRC(img);
            lastImg = img;
        }
        if (lastImg)
            bitBufferToFrameBuffer(lastImg->pix(), mappedFrameBuffer);
    }
}

void *screenRefresh(void *dummy) {
    while (true) {
        sleep_core_us(30000);
        updateLCD();
    }
}

void init() {
    DMESG("init screen");
    if (mappedFrameBuffer)
        return;
    int fd = open("/dev/fb0", O_RDWR);
    DMESG("init screen %d", fd);
    mappedFrameBuffer = (uint8_t *)mmap(NULL, FB_SIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    DMESG("map %p", mappedFrameBuffer);
    if (mappedFrameBuffer == MAP_FAILED) {
        target_panic(903);
    }

    pthread_t pid;
    pthread_create(&pid, NULL, screenRefresh, NULL);
    pthread_detach(pid);
}

static const uint8_t numbers[] = {
    0x06, 0x09, 0x09, 0x09, 0x06, 0x04, 0x06, 0x04, 0x04, 0x0e, 0x07, 0x08, 0x06,
    0x01, 0x0f, 0x0f, 0x08, 0x04, 0x09, 0x06, 0x0c, 0x0a, 0x09, 0x1f, 0x08, 0x1f,
    0x01, 0x0f, 0x10, 0x0f, 0x08, 0x04, 0x0e, 0x11, 0x0e, 0x1f, 0x08, 0x04, 0x02,
    0x01, 0x0e, 0x11, 0x0e, 0x11, 0x0e, 0x0e, 0x11, 0x0e, 0x04, 0x02,

    0x1b, 0x1b, 0x00, 0x1f, 0x1b,
};

static void drawNumber(uint8_t *dst, int idx) {
    const uint8_t *src = &numbers[idx * 5];
    for (int i = 0; i < 5; i++) {
        uint8_t ch = *src++;
        for (int jj = 0; jj < 8; ++jj) {
            for (int j = 0; j < 5; j++) {
                if (ch & (1 << j))
                    *dst = 0xff;
                dst++;
            }
            dst += ROW_SIZE - 5;
        }
    }
}

extern "C" void drawPanic(int code) {
    int fd = open("/dev/lms_ui", O_RDWR);
    uint8_t cmd[] = {48 + 5, 0};
    write(fd, cmd, 2);
    close(fd);

    uint8_t bitBuffer[ROW_SIZE * LCD_HEIGHT];

    memset(bitBuffer, 0, sizeof(bitBuffer));

    auto ptr = &bitBuffer[ROW_SIZE * 16 + 3 + 6];
    drawNumber(ptr, 10);

    ptr = &bitBuffer[ROW_SIZE * 70 + 3];

    drawNumber(ptr, (code / 100) % 10);
    ptr += 6;
    drawNumber(ptr, (code / 10) % 10);
    ptr += 6;
    drawNumber(ptr, (code / 1) % 10);
    ptr += 6;

    if (mappedFrameBuffer != MAP_FAILED) {
        bitBufferToFrameBuffer(bitBuffer, mappedFrameBuffer);
    }
}
}

namespace pxt {
void screen_init() {
    screen::init();
}
} // namespace pxt
