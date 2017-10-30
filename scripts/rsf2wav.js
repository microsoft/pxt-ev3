#!/usr/bin/env node

const fs = require("fs")

function convertFile(fn) {
    const rsf = fs.readFileSync(fn)

    const fmt = rsf.readInt16BE(0) // 0x0100
    if (fmt != 0x0100) {
        throw new Error("Invalid input format: " + fmt)
    }
    const size = rsf.readInt16BE(2)
    const samplerate = rsf.readInt16BE(4)
    const repeat = rsf.readInt16BE(6)

    const datasize = rsf.length - 8

    const wavHd = new Buffer(44)

    function writeMark(off, mark) {
        for (let i = 0; i < mark.length; ++i) {
            wavHd[off + i] = mark.charCodeAt(i)
        }
    }

    writeMark(0, 'RIFF')
    wavHd.writeInt32LE(datasize + 36, 4)
    writeMark(8, 'WAVE')
    writeMark(12, 'fmt ')
    wavHd.writeInt32LE(16, 16) // fmt size
    wavHd.writeInt16LE(1, 20) // PCM
    wavHd.writeInt16LE(1, 22) // mono, 1ch
    wavHd.writeInt32LE(samplerate, 24)
    wavHd.writeInt32LE(samplerate, 28) // byterate
    wavHd.writeInt16LE(1, 32) // block align
    wavHd.writeInt16LE(8, 34) // bits per sample
    writeMark(36, 'data')
    wavHd.writeInt32LE(datasize, 40)

    let wav = Buffer.concat([wavHd, rsf.slice(8)])
    return wav
}

let out = {
    "*": {
        namespace: "sounds",
        dataEncoding: "base64",
        mimeType: "audio/wav"
    }
}
let ts = "namespace sounds {\n"
let bf
for (let i = 2; i < process.argv.length; ++i) {
    let fn = process.argv[i]
    let m = /([^\/]+\/[^/]+)\.rsf$/.exec(fn)
    let bn = m[1]
    bf = convertFile(fn)
    bn = bn.replace(/[\/\-]/g, " ")
        .toLowerCase()
        .replace(/(\d)\s+/g, (f, n) => n)
        .replace(/\s+(.)/g, (f, l) => l.toUpperCase())
    out[bn] = bf.toString("base64")
    ts += `    //% fixedInstance jres\n`
    ts += `    export const ${bn} = music.fromWAV(hex\`\`);\n`
}
ts += `}\n`

fs.writeFileSync("out.json", JSON.stringify(out, null, 4))
fs.writeFileSync("out.ts", ts)
fs.writeFileSync("out.wav", bf)

//if (require("os").platform() == "darwin")
//    require('child_process').execSync("afplay out.wav")

// TODO also play on Windows
