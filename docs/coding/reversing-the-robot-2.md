# Reversing the robot Activity 2

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    motors.largeBC.run(50)
    sensors.touch2.pauseUntil(ButtonEvent.Pressed)
    motors.largeBC.run(0)
    pause(1000)
    brick.setStatusLight(StatusLight.OrangeFlash)
    motors.largeBC.run(-50)
    pause(2000)
    motors.largeBC.run(0)
})
```