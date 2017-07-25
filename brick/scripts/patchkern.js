let small = "010100000004010200000004020100004000020200004000030100000004040000008000"
let big   = "010100000004010200000004020100000002020200000002030100000001040000000001"

let fs = require("fs")

let kern = fs.readFileSync( "foo")
let kern2 = new Buffer(kern.toString("hex").replace(small, big), "hex")
fs.writeFileSync("foo2", kern2)
