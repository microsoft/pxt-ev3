namespace pxsim.image {
    function DMESG(msg: string) {
        control.dmesg(msg)
    }
    const NULL: RefBuffer = null;

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

        const res = output.createBuffer(3 + byteW * height);
        res.data[0] = 0xf1;
        res.data[1] = width;
        res.data[2] = height;
        let dst = 3
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
                res.data[dst] = ~(two[src++]);
                if (j == byteW - 1) {
                    res.data[dst] &= lastMask;
                }
                dst++;
            }
        }
        return image.ofBuffer(res)
    }
}

namespace pxsim.pxtcore {
    export function updateStats(str: string) {
        // TODO
    }
}