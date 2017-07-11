#include "pxt.h"
#include "ev3.h"
#include <pthread.h>

/**
* Drawing modes
*/
enum class Draw {
    Normal = 0, // set pixels to black, no fill
    Clear = DRAW_OPT_CLEAR_PIXELS,
    Xor = DRAW_OPT_LOGICAL_XOR,
    Fill = DRAW_OPT_FILL_SHAPE,
};

enum class ScreenFont {
    Normal = FONTTYPE_NORMAL,
    Small = FONTTYPE_SMALL,
    Large = FONTTYPE_LARGE,
    Tiny = FONTTYPE_TINY,
};

#define XX(v) ((uint32_t)(v)&0xffff)
#define YY(v) ((uint32_t)(v) >> 16)

// We only support up to 4 arguments for C++ functions - need to pack them on the TS side
namespace screen {

#define ROW_SIZE 32
#define FB_SIZE (60 * LCD_HEIGHT)

static const uint8_t pixmap[] = {0x00, 0xE0, 0x1C, 0xFC, 0x03, 0xE3, 0x1F, 0xFF};
static uint8_t bitBuffer[ROW_SIZE * LCD_HEIGHT];
static uint8_t *mappedFrameBuffer;
static bool dirty;

static void bitBufferToFrameBuffer(uint8_t *bitBuffer, uint8_t *fb) {
    uint32_t pixels;

    for (int line = 0; line < LCD_HEIGHT; line++) {
        int n = 7;
        while (n--) {
            pixels = *bitBuffer++ << 0;
            pixels |= *bitBuffer++ << 8;
            pixels |= *bitBuffer++ << 16;

            int m = 8;
            while (m--) {
                *fb++ = pixmap[pixels & 0x07];
                pixels >>= 3;
            }
        }

        pixels = *bitBuffer++ << 0;
        pixels |= *bitBuffer++ << 8;

        bitBuffer += ROW_SIZE - 26;

        int m = 4;
        while (m--) {
            *fb++ = pixmap[pixels & 0x07];
            pixels >>= 3;
        }
    }
}

static void updateLCD() {
    bitBufferToFrameBuffer(bitBuffer, mappedFrameBuffer);
}

#define OFF(x, y) (((y) << 5) + ((x) >> 3))
#define MASK(x, y) (1 << ((x)&7))

static inline void applyMask(int off, int mask, Draw mode) {
    if (mode & Draw::Clear)
        bitBuffer[off] &= ~mask;
    else if (mode & Draw::Xor)
        bitBuffer[off] ^= mask;
    else
        bitBuffer[off] |= mask;
}

//%
void _setPixel(int x, int y, Draw mode) {
    applyMask(OFF(x, y), MASK(x, y), mode);
}

void blitLineCore(int x, int y, int w, uint8_t *data, Draw mode) {
    if (y < 0 || y >= LMS.LCD_HEIGHT)
        return;
    if (x + w <= 0)
        return;
    if (x >= LMS.LCD_WIDTH)
        return;

    int shift = x & 7;
    int off = OFF(x, y);
    int off0 = OFF(0, y);
    int off1 = OFF(LMS.LCD_WIDTH - 1, y);
    int x1 = x + w;
    int prev = 0;

    while (x < x1 - 8) {
        int curr = *data++ << shift;
        if (off0 <= off && off <= off1)
            applyMask(off, curr | prev);
        off++;
        prev = curr >> 8;
        x += 8;
    }

    int left = x1 - x;
    if (left > 0) {
        int curr = *data << shift;
        if (off0 <= off && off <= off1)
            applyMask(off, (curr | prev) & ((1 << left) - 1));
    }
}

//%
void _blitLine(int xw, int y, Buffer buf, Draw mode) {
    blitLineCore(XX(xw), y, YY(xw), buf->data, mode);
}

static uint8_t ones[] = {
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
};

/** Draw an icon on the screen. */
//%
void drawIcon(int x, int y, Buffer buf, Draw mode) {
    if (buf->length < 2)
        return;
    int pixwidth = buf->data[0];
    if (pixwidth > 100)
        return;
    int ptr = 1;
    int bytewidth = (pixwidth + 7) >> 3;
    while (ptr + bytewidth <= buf->length) {
        if (mode == Draw::Normal)
            blitLineCore(x, y, pixwidth, ones, Draw::Clear);
        blitLineCore(x, y, pixwidth, &buf->data[ptr], mode);
        y++;
        ptr += bytewidth;
    }
}

/** Clear screen and reset font to normal. */
//%
void clear() {
    memset(bitBuffer, 0, sizeof(bitBuffer));
    dirty = true;
}
}

namespace pxt {

void *screenRefresh(void *dummy) {
    while (true) {
        sleep_core_us(30000);
        LcdUpdate();
    }
}

void screen_init() {
    LcdInitNoAutoRefresh();
    LcdClean();

    pthread_t pid;
    pthread_create(&pid, NULL, screenRefresh, NULL);
    pthread_detach(pid);
}
}
