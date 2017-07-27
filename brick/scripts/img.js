#!/bin/sh

let fs = require("fs")
// we try to use shorter versions of all parameters for the additional parameters to fit
let bootargs = "mem=${memsize} initrd=${filesysaddr},${filesyssize} root=/dev/ram0 rw rootfstype=cramfs console=${console} ip=${ipaddr} lpj=747520 quiet"
let bootnews = "mem=64M initrd=0xC1180000,10M root=1:0 rw rootfstype=cramfs console=${console} lpj=747520 musb_hdrc.use_dma=0 log_buf_len=128k quiet"
let piggy = true

function build() {
  if (bootnews.length > bootargs.length) {
    console.log("args too long")
    return
  }

  while (bootnews.length < bootargs.length)
    bootnews += " "

  let cr = fs.readFileSync("cram.bin")

  if (cr.length > 10485760) {
    console.log("too big by " + (cr.length - 10485760))
    return
  }
  let img = fs.readFileSync("EV3 Firmware V1.09D.bin")

  for (let i = 0; i < bootnews.length; ++i) {
    if (img[0x21DDA + i] != bootargs.charCodeAt(i)) {
      console.log("boot args mismatch")
      return 
    }
    img[0x21DDA + i] = bootnews.charCodeAt(i)
  }
  
  let off = 0x250000
  if (img[off] != 0x45 || img[off + 1] != 0x3d) {
    console.log("bad magic: " + img[off] + " / " + img[off+1])
    return
  }

  cr.copy(img, off)

  let kern = fs.readFileSync(piggy ? "piggy-patched.gzip" : "linux/arch/arm/boot/uImage")
  off = piggy ? 0x0005540f : 0x00050000

  if (img[off] != kern[0] || img[off+1] != kern[1]) {
    console.log("bad kernel magic: " + img[off] + " / " + img[off+1])
    return
  }

  kern.copy(img, off)

  fs.writeFileSync("firmware.bin", img)
}

build()
