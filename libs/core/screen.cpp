#include "pxt.h"
#include "ev3.h"

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
//%
void _drawLine(uint32_t p0, uint32_t p1, Draw mode) {
    LineOutEx(XX(p0), YY(p0), XX(p1), YY(p1), (uint32_t)mode);
}

//%
void _drawRect(uint32_t p0, uint32_t p1, Draw mode) {
    RectOutEx(XX(p0), YY(p0), XX(p1), YY(p1), (uint32_t)mode);
}

//%
void _drawEllipse(uint32_t p0, uint32_t p1, Draw mode) {
    EllipseOutEx(XX(p0), YY(p0), XX(p1), YY(p1), (uint32_t)mode);
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
