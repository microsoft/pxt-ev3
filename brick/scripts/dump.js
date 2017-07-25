#!/bin/sh

let fs = require("fs")

let styles = {
  "0": "rxtx",
  "1": "  tx",
  "2": "rx  ",
}

function build() {
  let kern = fs.readFileSync( "foo")
  let off = 0x0001df30

  kern = kern.slice(off + 6 * 5, off + 6 * (5 + 6))
console.log(kern.toString("hex"))
off = 0

for (let i = 0; i < 30; ++i) {
  if (kern[off+4] == 64) {
    kern[off+4] = 0
    kern[off+5] = 2
  }
if(kern[off] == 3 || kern[off] == 4) {
    kern[off+4] = 0
    kern[off+5] = 1
} 
  console.log(`ep=${kern[off]} style=${styles[kern[off+1]]} buf=${kern[off+2] == 0 ? "sin" : kern[off+2] == 1 ? "dbl" : "XXX"} pad=${kern[off+3]} sz=${kern[off+4]+(kern[off+5]<<8)}`)
  off += 6
}
console.log(kern.toString("hex"))
}

build()
