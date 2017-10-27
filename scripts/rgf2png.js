#!/usr/bin/env node

const fs = require("fs")
const zlib = require("zlib")

function compressImg(fn) {
    const rgf = fs.readFileSync(fn)

    const width = rgf[0]
    const height = rgf[1]

    const expSz = ((width + 7) >> 3) * height + 2

    console.log(`w=${width} h=${height} sz=${rgf.length} exp=${expSz}`)

    let crcTable

    function crc32(buf) {
        if (!crcTable) {
            crcTable = []
            for (let i = 0; i < 256; i++) {
                let curr = i;
                for (let j = 0; j < 8; j++) {
                    if (curr & 1) {
                        curr = 0xedb88320 ^ (curr >>> 1);
                    } else {
                        curr = curr >>> 1;
                    }
                }
                crcTable[i] = curr
            }
        }

        let crc = -1;
        for (var i = 0; i < buf.length; i++) {
            crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
        }
        return (crc ^ -1) >>> 0;
    }


    /*
    Width	4 bytes
    Height	4 bytes
    Bit depth	1 byte
    Colour type	1 byte
    Compression method	1 byte
    Filter method	1 byte
    Interlace method	1 byte
    */

    const chunks = []

    function addChunk(mark, addsize) {
        const buf = Buffer.alloc(mark.length + addsize)
        for (let i = 0; i < mark.length; ++i) {
            buf[i] = mark.charCodeAt(i)
        }
        chunks.push(buf)
        return buf
    }

    const hd = addChunk("IHDR", 4 + 4 + 5)
    hd.writeInt32BE(width, 4)
    hd.writeInt32BE(height, 8)
    hd[12] = 1 // bit depth
    hd[13] = 0 // color type - grayscale
    hd[14] = 0 // compression - deflate
    hd[15] = 0 // filter method
    hd[16] = 0 // interlace method - no interlace

    const scanlines = []
    const scanlen = (width + 7) >> 3

    let srcptr = 2
    let srcmask = 0x01
    for (let y = 0; y < height; ++y) {
        const scan = Buffer.alloc(1 + scanlen)
        scanlines.push(scan)
        let dstptr = 1
        let dstmask = 0x80
        for (let x = 0; x < width; ++x) {
            if (!(rgf[srcptr] & srcmask)) {
                scan[dstptr] |= dstmask
            }
            dstmask >>= 1;
            if (dstmask == 0) {
                dstmask = 0x80
                dstptr++
            }
            srcmask <<= 1;
            if (srcmask > 0x80) {
                srcmask = 0x01
                srcptr++
            }
        }
        if (srcmask != 0x01) {
            srcmask = 0x01
            srcptr++
        }

        if (false) {
            // seems to increase file size
            scan[0] = 1 // sub
            let prev = 0
            for (let i = 1; i < scan.length; ++i) {
                let p = scan[i]
                scan[i] = (p - prev) & 0xff
                prev = p
            }
        }
    }

    const dat = zlib.deflateSync(Buffer.concat(scanlines), {
        level: 9
    })
    const idat = addChunk("IDAT", dat.length)
    dat.copy(idat, 4)
    addChunk("IEND", 0)

    const output = [new Buffer([137, 80, 78, 71, 13, 10, 26, 10])]

    function intBuf(v) {
        let b = new Buffer(4)
        b.writeUInt32BE(v, 0)
        return b
    }
    for (let ch of chunks) {
        output.push(intBuf(ch.length - 4))
        output.push(ch)
        output.push(intBuf(crc32(ch)))
    }

    let outp = Buffer.concat(output)
    return outp
}

let sz = 0
let bf
let out = {}
for (let i = 2; i < process.argv.length; ++i) {
    let fn = process.argv[i]
    let m = /([^\/]+\/[^/]+)\.rgf$/.exec(fn)
    let bn = m[1]
    bf = compressImg(fn)
    out[bn] = "data:image/png;base64," + bf.toString("base64")
    sz += bf.length
}

console.log("total " + sz)
fs.writeFileSync("out.json", JSON.stringify(out, null, 4))
fs.writeFileSync("out.png", bf)

//if (require("os").platform() == "darwin")
//    require('child_process').execSync("afplay out.wav")

// TODO also play on Windows