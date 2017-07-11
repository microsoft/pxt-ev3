namespace screen {
    //% shim=screen::setPixelCore
    function setPixelCore(p0: uint32, p1: uint32, mode: Draw): void { }

    //% shim=screen::blitLine
    function blitLine(xw: uint32, y: uint32, buf: Buffer, mode: Draw): void { }

    function pack(x: number, y: number) {
        return Math.clamp(0, 512, x) | (Math.clamp(0, 512, y) << 16)
    }

    const ones = hex`ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff`

    function setLineCore(x: number, x1: number, y: number, mode: Draw) {
        blitLine(pack(x, x1 - x), y, ones, mode)
    }

    export interface Font {
        charWidth: number;
        charHeight: number;
        firstChar: number;
        data: Buffer;
    }
    let currFont: Font

    export const heart = hex`07 367f7f3e1c08`

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

    export function setPixel(x: number, y: number, mode = Draw.Normal) {
        x |= 0
        y |= 0
        if (0 <= x && x < LMS.LCD_WIDTH && 0 <= y && y < LMS.LCD_HEIGHT)
            setPixelCore(x, y, mode)
    }

    export function drawText(x: number, y: number, text: string, mode = Draw.Normal) {
        x |= 0
        y |= 0
        if (!currFont) currFont = defaultFont()
        let x0 = x
        let cp = 0
        let byteWidth = (currFont.charWidth + 7) >> 3
        let iconBuf = output.createBuffer(1 + byteWidth * currFont.charHeight)
        iconBuf[0] = currFont.charWidth
        while (cp < text.length) {
            let ch = text.charCodeAt(cp++)
            if (ch == 10) {
                y += currFont.charHeight + 2
                x = x0
            }
            if (ch < 32) continue
            let idx = (ch - currFont.firstChar) * byteWidth
            if (idx < 0 || idx + iconBuf.length - 1 > currFont.data.length)
                iconBuf.fill(0, 1)
            else
                iconBuf.write(1, currFont.data.slice(idx, byteWidth))
            drawIcon(x, y, iconBuf, mode)
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
        let x1 = Math.min(LMS.LCD_WIDTH, x + w);
        let y1 = Math.min(LMS.LCD_HEIGHT, y + h);
        if (w == 1) {
            while (y < y1)
                setPixelCore(x, y++, mode);
            return;
        }

        setLineCore(x, x1, y++, mode);
        while (y < y1 - 1) {
            if (mode & Draw.Fill) {
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


}