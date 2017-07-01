let i = 1
let f = 0.5
let plus = i + f
let minus = i - f

while (true) {
    let r = Math.random()
    serial.writeValue("R", r)
    loops.pause(1000)
}

//loops.forever(() => {
//})
