# Distance Measurer

```blocks
let distance = 0
let angle = 0
let measuring = false
let radius = 0
// Start and stop measuring with the enter button
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    if (measuring) {
        // turn off the measuring
        measuring = false
        brick.setStatusLight(StatusLight.Off)
    } else {
        // turn on the measuring clear the counters so that
        // the motor tracks the angle
        measuring = true
        motors.largeB.clearCounts()
        brick.setStatusLight(StatusLight.GreenPulse)
    }
})
radius = 2.5
brick.showString("Press ENTER to measure", 4)
forever(function () {
    if (measuring) {
        angle = motors.largeB.angle()
        distance = angle / 180 * Math.PI * radius
        brick.clearScreen()
        brick.showValue("angle", angle, 2)
        brick.showValue("distance", distance, 3)
    }
    pause(100)
})
```