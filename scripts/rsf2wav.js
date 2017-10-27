#!/usr/bin/env node

const fs = require("fs")
const rsf = fs.readFileSync(process.argv[2])

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

const wav = Buffer.concat([wavHd, rsf.slice(8)])

console.log("writing out.wav; " + samplerate + "Hz")
fs.writeFileSync("out.wav", wav)

if (require("os").platform() == "darwin")
    require('child_process').execSync("afplay out.wav")

// TODO also play on Windows
