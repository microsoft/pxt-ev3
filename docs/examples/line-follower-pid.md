
```blocks
let lasterror = 0
let D = 0
let I = 0
let P = 0
let error = 0
loops.forever(function () {
    error = sensors.color3.light(LightIntensityMode.Reflected) - 35
    P = error * 5
    I = I + error * 0.01
    D = (error - lasterror) * 0.2
    motors.largeBC.steer(P + (I + D), 100)
    lasterror = error
})
```