# Gradien follower PID + calibration

```blocks
let lasterror = 0
let D = 0
let I = 0
let P = 0
let error = 0
let setpoint = 0
let max = 0
let min = 0
let v = 0
v = sensors.color3.light(LightIntensityMode.Reflected)
min = v
max = v
setpoint = v
while (!(brick.buttonEnter.isPressed())) {
    brick.clearScreen()
    brick.showString("Move robot on terrain", 1)
    brick.showString("Press ENTER when done", 2)
    v = sensors.color3.light(LightIntensityMode.Reflected)
    min = Math.min(min, v)
    max = Math.max(max, v)
    setpoint = (max + min) / 2
    brick.showValue("v", v, 3)
    brick.showValue("min", min, 4)
    brick.showValue("max", v, 5)
    brick.showValue("setpoint", setpoint, 6)
    pause(100)
}
forever(function () {
    brick.clearScreen()
    v = sensors.color3.light(LightIntensityMode.Reflected)
    brick.showValue("light", v, 1)
    error = v - setpoint
    brick.showValue("error", error, 2)
    P = error * 5
    brick.showValue("P", P, 3)
    I = I + error * 0.01
    brick.showValue("I", I, 4)
    D = (error - lasterror) * 0.2
    brick.showValue("D", D, 5)
    motors.largeBC.steer(P + (I + D), 100)
    lasterror = error
    if (brick.buttonEnter.wasPressed()) {
        motors.largeBC.run(0)
        brick.buttonDown.pauseUntil(ButtonEvent.Bumped)
    }
})
```