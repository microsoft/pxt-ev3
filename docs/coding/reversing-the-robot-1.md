# Reversing the robot Activity 1

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    motors.largeBC.run(50)
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    motors.largeBC.run(0)
    pause(1000)
    brick.setStatusLight(StatusLight.OrangeFlash)
    motors.largeBC.run(-50)
    pause(2000)
    motors.largeBC.run(0)
})
```