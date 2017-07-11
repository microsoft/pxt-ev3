#include "pxt.h"
#include "ev3.h"
#include <pthread.h>

/**
* Drawing modes
*/
enum class Draw {
    Normal = 0x00, // set pixels to black, no fill
    Clear = 0x01,
    Xor = 0x02,
    Fill = 0x04,
    Transparent = 0x08,
    Double = 0x10,
};

inline bool operator&(Draw a, Draw b) {
    return ((int)a & (int)b) != 0;
}

inline Draw operator|(Draw a, Draw b) {
    return (Draw)((int)a | (int)b);
}

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

        bitBuffer += ROW_SIZE - 23;

        int m = 4;
        while (m--) {
            *fb++ = pixmap[pixels & 0x07];
            pixels >>= 3;
        }
    }
}

#define OFF(x, y) (((y) << 5) + ((x) >> 3))
#define MASK(x, y) (1 << ((x)&7))
#define PIX2BYTES(x) (((x) + 7) >> 3)

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
    if (y < 0 || y >= LCD_HEIGHT)
        return;
    if (x + w <= 0)
        return;
    if (x >= LCD_WIDTH)
        return;

    int shift = x & 7;
    int off = OFF(x, y);
    int off0 = OFF(0, y);
    int off1 = OFF(LCD_WIDTH - 1, y);
    int x1 = x + w + shift;
    int prev = 0;

    while (x < x1 - 8) {
        int curr = *data++ << shift;
        if (off0 <= off && off <= off1)
            applyMask(off, curr | prev, mode);
        off++;
        prev = curr >> 8;
        x += 8;
    }

    int left = x1 - x;
    if (left > 0) {
        int curr = *data << shift;
        if (off0 <= off && off <= off1)
            applyMask(off, (curr | prev) & ((1 << left) - 1), mode);
    }

    dirty = true;
}

//%
void _blitLine(int xw, int y, Buffer buf, Draw mode) {
    blitLineCore(XX(xw), y, YY(xw), buf->data, mode);
}

static uint8_t ones[] = {
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
};

bool isValidIcon(Buffer buf) {
    return buf->length >= 3 && buf->data[0] == 0xf0;
}

static const uint8_t bitdouble[] = {
    0x00, 0x03, 0x0c, 0x0f, 0x30, 0x33, 0x3c, 0x3f, 0xc0, 0xc3, 0xcc, 0xcf, 0xf0, 0xf3, 0xfc, 0xff,
};

/** Double size of an icon. */
//%
Buffer doubleIcon(Buffer buf) {
    if (!isValidIcon(buf))
        return NULL;
    int w = buf->data[1];
    if (w > 126)
        return NULL;
    int bw = PIX2BYTES(w);
    int h = (buf->length - 2) / bw;
    int bw2 = PIX2BYTES(w * 2);
    Buffer out = mkBuffer(NULL, 2 + bw2 * h * 2);
    out->data[0] = 0xf0;
    out->data[1] = w * 2;
    uint8_t *src = buf->data + 2;
    uint8_t *dst = out->data + 2;
    for (int i = 0; i < h; ++i) {
        for (int jj = 0; jj < 2; ++jj) {
            auto p = src;
            for (int j = 0; j < bw; ++j) {
                *dst++ = bitdouble[*p & 0xf];
                *dst++ = bitdouble[*p >> 4];
                p++;
            }
        }
        src += bw;
    }
    return out;
}

/** Draw an icon on the screen. */
//%
void drawIcon(int x, int y, Buffer buf, Draw mode) {
    if (!isValidIcon(buf))
        return;
    if (mode & Draw::Double)
        buf = doubleIcon(buf);

    int pixwidth = buf->data[1];
    int ptr = 2;
    int bytewidth = PIX2BYTES(pixwidth);
    pixwidth = min(pixwidth, LCD_WIDTH);
    while (ptr + bytewidth <= buf->length) {
        if (mode & (Draw::Clear | Draw::Xor | Draw::Transparent)) {
            // no erase of background
        } else {
            blitLineCore(x, y, pixwidth, ones, Draw::Clear);
        }
        blitLineCore(x, y, pixwidth, &buf->data[ptr], mode);
        y++;
        ptr += bytewidth;
    }

    if (mode & Draw::Double)
        decrRC(buf);
}

/** Clear screen and reset font to normal. */
//%
void clear() {
    memset(bitBuffer, 0, sizeof(bitBuffer));
    dirty = true;
}

//%
void dump() {
    char buf[LCD_WIDTH + 1];
    FILE *f = fopen("/tmp/screen.txt", "w");
    for (int i = 0; i < LCD_HEIGHT; ++i) {
        for (int j = 0; j < LCD_WIDTH; ++j) {
            if (bitBuffer[OFF(j, i)] & MASK(j, i))
                buf[j] = '#';
            else
                buf[j] = '.';
        }
        buf[LCD_WIDTH] = 0;
        fprintf(f, "%s\n", buf);
    }
    fclose(f);
}

static uint8_t *mappedFrameBuffer;

//%
void updateLCD() {
    if (dirty && mappedFrameBuffer != MAP_FAILED) {
        dirty = false;
        bitBufferToFrameBuffer(bitBuffer, mappedFrameBuffer);
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
        target_panic(111);
    }
    clear();

    pthread_t pid;
    pthread_create(&pid, NULL, screenRefresh, NULL);
    pthread_detach(pid);
}
}

namespace pxt {
void screen_init() {
    screen::init();
}
}
