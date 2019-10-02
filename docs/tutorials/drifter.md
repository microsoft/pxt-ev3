# Drifter

Use this program to try out the gyro sensor and the effect of drifting.

```typescript
// this loop shows the rate, angle and drift of the robot
forever(() => {
    brick.showValue("rate", sensors.gyro2.rate(), 1)
    brick.showValue("angle", sensors.gyro2.angle(), 2)
    brick.showValue("drift", sensors.gyro2.drift(), 3)
})
// this loop shows wheter the sensor is calibrating
forever(() => {
    brick.showString(sensors.gyro2.isCalibrating() ? "calibrating..." : "", 4)
})
// instructions on how to use the buttons
brick.showString("ENTER: calibrate", 7)
brick.showString("       (reset+drift)", 8)
brick.showString("LEFT: reset", 9)
brick.showString("RIGHT: compute drift", 10)

// enter -> calibrate
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.gyro2.calibrate()
})
// right -> compute drift
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    sensors.gyro2.computeDrift()
})
// left -> reset
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    sensors.gyro2.reset()
})
```