#!/bin/sh

let fs = require("fs")

function build() {
  let cr = fs.readFileSync("cram.bin")
  if (cr.length > 10878976) {
    console.log("too big")
    return
  }
  let img = fs.readFileSync("boot.bin")
  let off = 0x250000
  if (img[off] != 0x45 || img[off + 1] != 0x3d) {
    console.log("bad magic: " + img[off] + " / " + img[off+1])
    return
  }

  cr.copy(img, off)

  let kern = fs.readFileSync("piggy-patched.gzip")
  off = 0x0005540f

  if (img[off] != kern[0] || img[off+1] != kern[1]) {
    console.log("bad kernel magic: " + img[off] + " / " + img[off+1])
    return
  }

  kern.copy(img, off)

  fs.writeFileSync("firmware.bin", img)
}

build()
