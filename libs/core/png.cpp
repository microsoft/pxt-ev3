#include "pxt.h"
#include "ev3const.h"
#include <zlib.h>
#include <stdlib.h>

struct PNGHeader {
    uint8_t pngHeader[8];
    uint32_t lenIHDR;
    uint8_t IHDR[4];
    uint32_t width;
    uint32_t height;
    uint8_t bitDepth;
    uint8_t colorType;
    uint8_t compressionMethod;
    uint8_t filterMethod;
    uint8_t interlaceMethod;
    uint32_t hdCRC;
    uint32_t lenIDAT;
    uint8_t IDAT[4];
} __attribute__((packed));

namespace screen {

static uint32_t swap(uint32_t num) {
    return ((num >> 24) & 0xff) | ((num << 8) & 0xff0000) | ((num >> 8) & 0xff00) |
           ((num << 24) & 0xff000000);
}

/** Decompresses a 1-bit gray scale PNG image to image format. */
//%
Image unpackPNG(Buffer png) {
    if (!png) {
        DMESG("PNG: Missing image");
        return NULL;
    }
    if (png->length < sizeof(PNGHeader) + 4) {
        DMESG("PNG: File too small");
        return NULL;
    }

    if (memcmp(png->data, "\x89PNG\r\n\x1A\n", 8) != 0) {
        DMESG("PNG: Invalid header");
        return NULL;
    }

    struct PNGHeader hd;
    memcpy(&hd, png->data, sizeof(hd));

    if (memcmp(hd.IHDR, "IHDR", 4) != 0) {
        DMESG("PNG: missing IHDR");
        return NULL;
    }

    hd.lenIHDR = swap(hd.lenIHDR);
    hd.width = swap(hd.width);
    hd.height = swap(hd.height);
    hd.lenIDAT = swap(hd.lenIDAT);

    if (hd.lenIHDR != 13) {
        DMESG("PNG: bad IHDR len");
        return NULL;
    }
    if (hd.bitDepth != 1 || hd.colorType != 0 || hd.compressionMethod != 0 ||
        hd.filterMethod != 0 || hd.interlaceMethod != 0) {
        DMESG("PNG: not 1-bit grayscale");
        return NULL;
    }
    if (memcmp(hd.IDAT, "IDAT", 4) != 0) {
        DMESG("PNG: missing IDAT");
        return NULL;
    }
    if (hd.lenIDAT + sizeof(hd) >= png->length) {
        DMESG("PNG: buffer too short");
        return NULL;
    }
    if (hd.width > 300 || hd.height > 300) {
        DMESG("PNG: too big");
        return NULL;
    }

    uint32_t byteW = (hd.width + 7) >> 3;
    uint32_t expSize = (byteW + 1) * hd.height;
    unsigned long sz = expSize;
    uint8_t *tmp = (uint8_t *)xmalloc(sz);
    int code = uncompress(tmp, &sz, png->data + sizeof(hd), hd.lenIDAT);
    if (code != 0) {
        DMESG("PNG: zlib failed: %d", code);
        free(tmp);
        return NULL;
    }
    if (sz != expSize) {
        DMESG("PNG: invalid compressed size");
        free(tmp);
        return NULL;
    }

    auto res = mkImage(hd.width, hd.height, 1);

    uint8_t *dst = res->pix();
    uint8_t *src = tmp;
    uint8_t lastMask = 0xff << (8 - (hd.width & 7));
    if (lastMask == 0)
        lastMask = 0xff;
    for (uint32_t i = 0; i < hd.height; ++i) {
        if (*src++ != 0) {
            DMESG("PNG: unsupported filter");
            free(tmp);
            decrRC(res);
            return NULL;
        }
        for (uint32_t j = 0; j < byteW; ++j) {
            *dst = ~*src++;
            if (j == byteW - 1) {
                *dst &= lastMask;
            }
            dst++;
        }
    }
    free(tmp);
    return res;
}
}
