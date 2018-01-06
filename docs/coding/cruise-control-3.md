# Cruise Control Activity 3

```blocks
let speed = 0
function decelerate() {
    if (speed > -100) {
        speed = speed - 10
    }
}
function accelerate() {
    if (speed < 100) {
        speed = speed + 10
    }
}
function update() {
    brick.clearScreen()
    brick.printLine("speed: " + speed, 1)
    motors.largeBC.setSpeed(speed)
}
sensors.touch2.onEvent(TouchSensorEvent.Pressed, function () {
    accelerate()
    update()
})
sensors.touch1.onEvent(TouchSensorEvent.Pressed, function () {
    decelerate()
    update()
})
```