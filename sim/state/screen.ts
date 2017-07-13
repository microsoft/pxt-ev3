
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

    const bitdouble = [
        0x00, 0x03, 0x0c, 0x0f, 0x30, 0x33, 0x3c, 0x3f, 0xc0, 0xc3, 0xcc, 0xcf, 0xf0, 0xf3, 0xfc, 0xff,
    ]

    export function isValidIcon(buf: RefBuffer) {
        return buf.data.length >= 3 && buf.data[0] == 0xf0;
    }

    function PIX2BYTES(x: number) {
        return ((x + 7) >> 3)
    }

    export function drawIcon(x: number, y: number, buf: RefBuffer, mode: Draw): void {
        const screenState = (board() as DalBoard).screenState;

        if (!isValidIcon(buf))
            return;

        if (mode & (Draw.Double | Draw.Quad)) {
            buf = doubleIcon(buf);
            if (mode & Draw.Quad) {
                let pbuf = buf;
                buf = doubleIcon(buf);
                decr(pbuf);
            }
        }

        let pixwidth = buf.data[1];
        let ptr = 2;
        const bytewidth = PIX2BYTES(pixwidth);
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

        if (mode & Draw.Double)
            decr(buf);
    }

    export function clear(): void {
        const screenState = (board() as DalBoard).screenState;
        screenState.clear()
    }

    export function doubleIcon(buf: RefBuffer): RefBuffer {
        if (!isValidIcon(buf))
            return null;
        const w = buf.data[1];
        if (w > 126)
            return null;
        const bw = PIX2BYTES(w);
        const h = ((buf.data.length - 2) / bw) | 0;
        const bw2 = PIX2BYTES(w * 2);
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

    export function dump() {
        // do we need it?
    }
}