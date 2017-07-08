let lines = require("fs").readFileSync(process.argv[2], "utf8").split(/\n/)

let off = 0

let typemap = {
  DATA8: "int8",
  DATA16: "int16",
  DATA32: "int32",
  UBYTE: "uint8",
  UWORD: "uint16",
  ULONG: "uint32",
  SBYTE: "int8",
  SWORD: "int16",
  SLONG: "int32",
  DATAF: "float32",
}

for (let l of lines) {
  l = l.trim()
  if (/= \[/.test(l)) {
     console.log("\n\nconst enum X {")
     off = 0
     continue
  }
  if (l == "]") {
    console.log(`    Size = ${off}`)
     console.log("}")
     continue
  }
  if (!l) continue
  let m = /\('(\w+)', (\w+)( \* (\d+))?\)/.exec(l)
  if (!m)
     m = /\('(\w+)', \((\w+)( \* (\d+))\) \* (\d+)/.exec(l)
  if (!m)
     m = /\('(\w+)', \(\((\w+)( \* (\d+))\) \* (\d+)\) \* (\d+)/.exec(l)
  if (m) {
    let tp = typemap[m[2]]
    if (!tp) {
      console.log("unknown type: " + m[2])
      break
    }
    let sz = parseInt(tp.replace(/[^\d]/g, "")) / 8
    let suff = ""
    if (m[4]) {
      sz *= parseInt(m[4])
      suff = "[" + m[4] + "]"
    }
    if (m[5]) {
      sz *= parseInt(m[5])
      suff += "[" + m[5] + "]"
    }
    if (m[6]) {
      sz *= parseInt(m[6])
      suff += "[" + m[6] + "]"
    }
    console.log(`    ${m[1]} = ${off}, // ${tp}${suff}`)
    off += sz
  } else {
    console.log("bad line: " + l)
    break
  }
}
