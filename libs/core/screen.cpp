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

static inline void setPixelCore(int x, int y, Draw mode) {
    applyMask(OFF(x, y), MASK(x, y), mode);
}

static void setLineCore(int x0, int x1, int y, Draw mode) {
    while (x0 < x1 && (x0 & 7)) {
        setPixelCore(x0++, y, mode);
    }
    int off = OFF(x0, y);
    // 8-aligned now
    while (x0 < x1 - 8) {
        applyMask(off++, 0xff, mode);
        x0 += 8;
    }
    while (x0 < x1) {
        setPixelCore(x0++, y, mode);
    }
    dirty = true;
}

void drawRect(int x, int y, int w, int h, Draw mode) {
    if (x < 0) {
        w += x;
        x = 0;
    }
    if (y < 0) {
        h += y;
        y = 0;
    }
    if (w <= 0)
        return;
    if (h <= 0)
        return;
    int x1 = min(LCD_WIDTH, x + w);
    int y1 = min(LCD_HEIGHT, y + h);
    if (w == 1) {
        while (y < y1)
            setPixelCore(x, y++, mode);
        return;
    }

    setLineCore(x, x1, y++, mode);
    while (y < y1 - 1) {
        if (mode & Draw::Fill) {
            setLineCore(x, x1, y, mode);
        } else {
            setPixelCore(x, y, mode);
            setPixelCore(x1 - 1, y, mode);
        }
        y++;
    }
    if (y < y1)
        setLineCore(x, x1, y, mode);
}

void blitLine(int x, int y, int w, uint8_t *data, Draw mode) {
    int shift = x & 7;
    int off = OFF(x, y);
    int x1 = x + w;
    int prev = 0;

    while (x < x1 - 8) {
        int curr = *data++ << shift;
        applyMask(off++, curr | prev);
        prev = curr >> 8;
        x += 8;
    }

    int left = x1 - x;
    if (left > 0) {
        int curr = *data << shift;
        applyMask(off, (curr | prev) & ((1 << left) - 1));
    }
}

/** Update a pixel on the screen. */
//%
void setPixel(int x, int y, Draw mode) {
    if (0 <= x && x < LCD_WIDTH && 0 <= y && y <= LCD_HEIGHT) {
        setPixelCore(x, y, mode);
        dirty = true;
    }
}

//%
void _drawRect(uint32_t p0, uint32_t p1, Draw mode) {
    drawRect(XX(p0), YY(p0), XX(p1), YY(p1), mode);
}

static int fontFirst, fontWidth, fontHeight, fontByteWidth;
static uint8_t *fontChars;
static Buffer currFont;

/** Set font. */
//%
void setFont(Buffer font) {
    if (!font || font->length < 100)
        return;
    if (font->data[0] != 0xf0 || font->data[1] != 0x42)
        return;
    fontFirst = font->data[2];
    fontWidth = font->data[3];
    fontHeight = font->data[4];
    fontByteWidth = (fontWidth + 7) / 8;
    fontChars = &font->data[8];
}

/** Draw text. */
//% mode.defl=0
void drawText(int x, int y, String text, Draw mode) {
    LcdText((int)mode & (int)Draw::Clear ? 0 : 1, x, y, text->data);
}

/** Clear screen and reset font to normal. */
//%
void clear() {
    LcdClearDisplay();
}

/** Scroll screen vertically. */
//%
void scroll(int v) {
    LcdScroll(v);
}

/** Set font for drawText() */
//%
void setFont(ScreenFont font) {
    LcdSelectFont((uint8_t)font);
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
