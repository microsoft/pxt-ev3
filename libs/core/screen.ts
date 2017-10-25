namespace screen {
    //% shim=screen::_setPixel
    function _setPixel(p0: uint32, p1: uint32, mode: Draw): void { }

    //% shim=screen::_blitLine
    function _blitLine(xw: uint32, y: uint32, buf: Buffer, mode: Draw): void { }

    function pack(x: number, y: number) {
        return Math.clamp(0, 512, x) | (Math.clamp(0, 512, y) << 16)
    }

    const ones = hex`ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`

    function setLineCore(x: number, x1: number, y: number, mode: Draw) {
        _blitLine(pack(x, x1 - x), y, ones, mode)
    }

    export interface Font {
        charWidth: number;
        charHeight: number;
        firstChar: number;
        data: Buffer;
    }
    let currFont: Font

    export function setFont(f: Font) {
        currFont = f
    }

    export const heart = hex`f007 367f7f3e1c08`

    export function defaultFont(): Font {
        return {
            charWidth: 8,
            charHeight: 8,
            firstChar: 32,
            // source https://github.com/dhepper/font8x8
            data: hex`
0000000000000000 183C3C1818001800 3636000000000000 36367F367F363600 0C3E031E301F0C00 006333180C666300
1C361C6E3B336E00 0606030000000000 180C0606060C1800 060C1818180C0600 00663CFF3C660000 000C0C3F0C0C0000
00000000000C0C06 0000003F00000000 00000000000C0C00 6030180C06030100 3E63737B6F673E00 0C0E0C0C0C0C3F00
1E33301C06333F00 1E33301C30331E00 383C36337F307800 3F031F3030331E00 1C06031F33331E00 3F3330180C0C0C00
1E33331E33331E00 1E33333E30180E00 000C0C00000C0C00 000C0C00000C0C06 180C0603060C1800 00003F00003F0000
060C1830180C0600 1E3330180C000C00 3E637B7B7B031E00 0C1E33333F333300 3F66663E66663F00 3C66030303663C00
1F36666666361F00 7F46161E16467F00 7F46161E16060F00 3C66030373667C00 3333333F33333300 1E0C0C0C0C0C1E00
7830303033331E00 6766361E36666700 0F06060646667F00 63777F7F6B636300 63676F7B73636300 1C36636363361C00
3F66663E06060F00 1E3333333B1E3800 3F66663E36666700 1E33070E38331E00 3F2D0C0C0C0C1E00 3333333333333F00
33333333331E0C00 6363636B7F776300 6363361C1C366300 3333331E0C0C1E00 7F6331184C667F00 1E06060606061E00
03060C1830604000 1E18181818181E00 081C366300000000 00000000000000FF 0C0C180000000000 00001E303E336E00
0706063E66663B00 00001E3303331E00 3830303e33336E00 00001E333f031E00 1C36060f06060F00 00006E33333E301F
0706366E66666700 0C000E0C0C0C1E00 300030303033331E 070666361E366700 0E0C0C0C0C0C1E00 0000337F7F6B6300
00001F3333333300 00001E3333331E00 00003B66663E060F 00006E33333E3078 00003B6E66060F00 00003E031E301F00
080C3E0C0C2C1800 0000333333336E00 00003333331E0C00 0000636B7F7F3600 000063361C366300 00003333333E301F
00003F190C263F00 380C0C070C0C3800 1818180018181800 070C0C380C0C0700 6E3B000000000000 0000000000000000
`
        }
    }

    export function microbitFont() {
        return {
            charWidth: 6,
            charHeight: 5,
            firstChar: 32,
            // source https://github.com/lancaster-university/microbit-dal/blob/master/source/core/MicroBitFont.cpp
            data: hex`
0000000000 0202020002 0a0a000000 0a1f0a1f0a 0e130e190e 1309041219 0609060916 0202000000 0402020204 
0204040402 000a040a00 00040e0400 0000000402 00000e0000 0000000200 1008040201 0609090906 040604040e 
070806010f 0f08040906 0c0a091f08 1f010f100f 08040e110e 1f08040201 0e110e110e 0e110e0402 0002000200 
0004000402 0804020408 000e000e00 0204080402 0e110c0004 0e11151906 06090f0909 0709070907 0e0101010e 
0709090907 0f0107010f 0f01070101 0e0119110e 09090f0909 0702020207 1f08080906 0905030509 010101010f 
111b151111 1113151911 0609090906 0709070101 060909060c 0709070911 0e01060807 1f04040404 0909090906 
1111110a04 1111151b11 0909060909 110a040404 0f0402010f 0e0202020e 0102040810 0e0808080e 040a000000 
000000001f 0204000000 000e09091e 0101070907 000e01010e 08080e090e 060907010e 0c02070202 0e090e0806 
0101070909 0200020202 0800080806 0105030509 020202020c 001b151111 0007090909 0006090906 0007090701 
000e090e08 000e010101 000c020403 02020e021c 000909091e 0011110a04 001111151b 0009060609 00110a0403 
000f04020f 0c0406040c 0202020202 0302060203 0000061800
`
        }
    }

    /**
     * Sets a pixel on or off
     * @param on a value indicating if the pixel should be on or off
     * @param x the starting position's x coordinate, eg: 0
     * @param y the starting position's x coordinate, eg: 0
     */
    //% blockId=screen_setpixel block="set pixel %on| at x: %x| y: %y"
    //% weight=98 group="Brick" blockNamespace=output
    //% x.min=0 x.max=178 y.min=0 y.max=128 on.fieldEditor=toggleonoff
    export function setPixel(on: boolean, x: number, y: number) {
        x |= 0
        y |= 0
        if (0 <= x && x < DAL.LCD_WIDTH && 0 <= y && y < DAL.LCD_HEIGHT)
            _setPixel(x, y, on ? Draw.Normal : Draw.Clear)
    }

    /**
     * Show text on the screen.
     * @param text the text to print on the screen, eg: "Hello world"
     * @param x the starting position's x coordinate, eg: 0
     * @param y the starting position's x coordinate, eg: 0
     */
    //% blockId=screen_print block="print %text| at x: %x| y: %y"
    //% weight=99 group="Brick" blockNamespace=output inlineInputMode="inline"
    //% x.min=0 x.max=178 y.min=0 y.max=128
    export function print(text: string, x: number, y: number, mode = Draw.Normal) {
        x |= 0
        y |= 0
        if (!currFont) currFont = defaultFont()
        let x0 = x
        let cp = 0
        let byteWidth = (currFont.charWidth + 7) >> 3
        let charSize = byteWidth * currFont.charHeight
        let iconBuf = output.createBuffer(2 + charSize)
        let double = (mode & Draw.Quad) ? 4 : (mode & Draw.Double) ? 2 : 1
        iconBuf[0] = 0xf0
        iconBuf[1] = currFont.charWidth
        while (cp < text.length) {
            let ch = text.charCodeAt(cp++)
            if (ch == 10) {
                y += double * currFont.charHeight + 2
                x = x0
            }
            if (ch < 32) continue
            let idx = (ch - currFont.firstChar) * charSize
            if (idx < 0 || idx + iconBuf.length - 1 > currFont.data.length)
                iconBuf.fill(0, 2)
            else
                iconBuf.write(2, currFont.data.slice(idx, charSize))
            drawIcon(x, y, iconBuf, mode)
            x += double * currFont.charWidth
        }
    }

    export function drawRect(x: number, y: number, w: number, h: number, mode = Draw.Normal) {
        x |= 0;
        y |= 0;
        w |= 0;
        h |= 0;
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
        let x1 = Math.min(DAL.LCD_WIDTH, x + w);
        let y1 = Math.min(DAL.LCD_HEIGHT, y + h);
        if (w == 1) {
            while (y < y1)
                _setPixel(x, y++, mode);
            return;
        }

        setLineCore(x, x1, y++, mode);
        while (y < y1 - 1) {
            if (mode & Draw.Fill) {
                setLineCore(x, x1, y, mode);
            } else {
                _setPixel(x, y, mode);
                _setPixel(x1 - 1, y, mode);
            }
            y++;
        }
        if (y < y1)
            setLineCore(x, x1, y, mode);
    }


}