
namespace pxsim {

    function OFF(x: number, y: number) {
        return x + y * visuals.SCREEN_WIDTH
    }


    export class EV3ScreenState {
        shouldUpdate: boolean;
        points: Uint8Array;
        constructor() {
            this.points = new Uint8Array(visuals.SCREEN_WIDTH * visuals.SCREEN_HEIGHT)
        }

        applyMode(off: number, v: number) {
            if (v & Draw.Clear)
                this.points[off] = 0;
            else if (v & Draw.Xor)
                this.points[off] = this.points[off] ? 0 : 255;
            else
                this.points[off] = 255;
        }

        setPixel(x: number, y: number, v: number) {
            this.applyMode(OFF(x, y), v)
            this.shouldUpdate = true;
        }

        clear() {
            for (let i = 0; i < this.points.length; ++i)
                this.points[i] = 0;
            this.shouldUpdate = true;
        }

        blitLineCore(x: number, y: number, w: number, buf: RefBuffer, mode: Draw, offset = 0) {
            if (y < 0 || y >= visuals.SCREEN_HEIGHT)
                return;
            if (x + w <= 0)
                return;
            if (x >= visuals.SCREEN_WIDTH)
                return;

            let off = OFF(x, y);
            const off0 = OFF(0, y);
            const off1 = OFF(visuals.SCREEN_WIDTH - 1, y);
            let mask = 0x01
            let dp = offset

            for (let i = 0; i < w; ++i) {
                if ((buf.data[dp] & mask) && off0 <= off && off <= off1) {
                    this.applyMode(off, mode);
                }
                off++
                mask <<= 1
                if (mask & 0x100) {
                    mask = 0x01
                    dp++
                }
            }

            this.shouldUpdate = true;
        }

        clearLine(x: number, y: number, w: number) {
            let off = OFF(x, y);
            const off0 = OFF(0, y);
            const off1 = OFF(visuals.SCREEN_WIDTH - 1, y);
            for (let i = 0; i < w; ++i) {
                if (off0 <= off && off <= off1) {
                    this.points[off] = 0
                }
                off++
            }
        }
    }
}


namespace pxsim.screen {
    function XX(v: number) { return (v << 16) >> 16 }
    function YY(v: number) { return v >> 16 }

    export function _setPixel(x: number, y: number, mode: Draw) {
        const screenState = (board() as DalBoard).screenState;
        screenState.setPixel(x, y, mode);
    }

    export function _blitLine(xw: number, y: number, buf: RefBuffer, mode: Draw) {
        const screenState = (board() as DalBoard).screenState;
        screenState.blitLineCore(XX(xw), y, YY(xw), buf, mode)
    }

    export function isValidImage(buf: RefBuffer) {
        return buf.data.length >= 3 && buf.data[0] == 0xf0;
    }

    export function PIX2BYTES(x: number) {
        return ((x + 7) >> 3)
    }
    export function clear(): void {
        const screenState = (board() as DalBoard).screenState;
        screenState.clear()
    }

    export function dump() {
        // No need for this one.
    }

    export function imageOf(buf: RefBuffer) {
        return incr(buf)
    }
}

namespace pxsim.screen {
    function DMESG(msg: string) {
        control.dmesg(msg)
    }
    const NULL: RefBuffer = null;
    function revbits(v: number) {
        v = (v & 0xf0) >> 4 | (v & 0x0f) << 4;
        v = (v & 0xcc) >> 2 | (v & 0x33) << 2;
        v = (v & 0xaa) >> 1 | (v & 0x55) << 1;
        return v;
    }

    export function unpackPNG(png: RefBuffer) {
        function memcmp(off: number, mark: string) {
            for (let i = 0; i < mark.length; ++i) {
                if (mark.charCodeAt(i) != png.data[off + i])
                    return 1
            }
            return 0
        }
        function readInt(off: number) {
            return ((png.data[off] << 24) | (png.data[off + 1] << 16) |
                (png.data[off + 2] << 8) | (png.data[off + 3])) >>> 0
        }
        if (!png) {
            DMESG("PNG: Missing image");
            return NULL;
        }
        if (png.data.length < 45) {
            DMESG("PNG: File too small");
            return NULL;
        }

        if (memcmp(0, "\x89PNG\r\n\x1A\n") != 0) {
            DMESG("PNG: Invalid header");
            return NULL;
        }

        if (memcmp(12, "IHDR") != 0) {
            DMESG("PNG: missing IHDR");
            return NULL;
        }

        const lenIHDR = readInt(8);
        const width = readInt(16);
        const height = readInt(20);
        const lenIDAT = readInt(33);
        const sizeOfHD = 41;

        if (lenIHDR != 13) {
            DMESG("PNG: bad IHDR len");
            return NULL;
        }
        if (memcmp(24, "\x01\x00\x00\x00\x00") != 0) {
            DMESG("PNG: not 1-bit grayscale");
            return NULL;
        }
        if (memcmp(37, "IDAT") != 0) {
            DMESG("PNG: missing IDAT");
            return NULL;
        }
        if (lenIDAT + sizeOfHD >= png.data.length) {
            DMESG("PNG: buffer too short");
            return NULL;
        }
        if (width > 300 || height > 300) {
            DMESG("PNG: too big");
            return NULL;
        }

        const byteW = (width + 7) >> 3;
        const sz = (byteW + 1) * height;
        const tmp = new Uint8Array(sz + 1);
        // uncompress doesn't take the zlib header, hence + 2
        const two = tinf.uncompress(png.data.slice(sizeOfHD + 2, sizeOfHD + lenIDAT), tmp);
        if (two.length != sz) {
            DMESG("PNG: invalid compressed size");
            return NULL;
        }

        const res = output.createBuffer(2 + byteW * height);
        res.data[0] = 0xf0;
        res.data[1] = width;
        let dst = 2
        let src = 0
        let lastMask = (1 << (width & 7)) - 1;
        if (lastMask == 0)
            lastMask = 0xff;
        for (let i = 0; i < height; ++i) {
            if (two[src++] != 0) {
                DMESG("PNG: unsupported filter");
                decr(res);
                return NULL;
            }
            for (let j = 0; j < byteW; ++j) {
                res.data[dst] = ~revbits(two[src++]);
                if (j == byteW - 1) {
                    res.data[dst] &= lastMask;
                }
                dst++;
            }
        }
        return res;
    }
}

namespace pxsim.ImageMethods {
    const bitdouble = [
        0x00, 0x03, 0x0c, 0x0f, 0x30, 0x33, 0x3c, 0x3f, 0xc0, 0xc3, 0xcc, 0xcf, 0xf0, 0xf3, 0xfc, 0xff,
    ]

    export function buffer(buf: RefBuffer) {
        return incr(buf)
    }

    export function width(buf: RefBuffer) {
        if (!screen.isValidImage(buf)) return 0
        return buf.data[1]
    }

    export function height(buf: RefBuffer) {
        if (!screen.isValidImage(buf)) return 0
        const bw = screen.PIX2BYTES(buf.data[1]);
        const h = ((buf.data.length - 2) / bw) | 0;
        return h
    }

    export function draw(buf: RefBuffer, x: number, y: number, mode: Draw): void {
        const screenState = (board() as DalBoard).screenState;

        if (!screen.isValidImage(buf))
            return;

        if (mode & (Draw.Double | Draw.Quad)) {
            buf = doubled(buf);
            if (mode & Draw.Quad) {
                let pbuf = buf;
                buf = doubled(buf);
                decr(pbuf);
            }
        }

        let pixwidth = buf.data[1];
        let ptr = 2;
        const bytewidth = screen.PIX2BYTES(pixwidth);
        pixwidth = Math.min(pixwidth, visuals.SCREEN_WIDTH);
        while (ptr + bytewidth <= buf.data.length) {
            if (mode & (Draw.Clear | Draw.Xor | Draw.Transparent)) {
                // no erase of background
            } else {
                screenState.clearLine(x, y, pixwidth)
            }
            screenState.blitLineCore(x, y, pixwidth, buf, mode, ptr);
            y++;
            ptr += bytewidth;
        }

        if (mode & (Draw.Double | Draw.Quad))
            decr(buf);
    }

    export function doubled(buf: RefBuffer): RefBuffer {
        if (!screen.isValidImage(buf))
            return null;
        const w = buf.data[1];
        if (w > 126)
            return null;
        const bw = screen.PIX2BYTES(w);
        const h = ((buf.data.length - 2) / bw) | 0;
        const bw2 = screen.PIX2BYTES(w * 2);
        const out = pins.createBuffer(2 + bw2 * h * 2)
        out.data[0] = 0xf0;
        out.data[1] = w * 2;
        let src = 2
        let dst = 2
        for (let i = 0; i < h; ++i) {
            for (let jj = 0; jj < 2; ++jj) {
                let p = src;
                for (let j = 0; j < bw; ++j) {
                    const v = buf.data[p++]
                    out.data[dst++] = bitdouble[v & 0xf];
                    out.data[dst++] = bitdouble[v >> 4];
                }
            }
            src += bw;
        }
        return out;
    }


}
