# Reversing the robot Activity 2

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    motors.largeBC.setSpeed(50)
    sensors.touch2.pauseUntil(ButtonEvent.Pressed)
    motors.largeBC.setSpeed(0)
    loops.pause(1000)
    brick.setStatusLight(BrickLight.OrangeFlash)
    motors.largeBC.setSpeed(-50)
    loops.pause(2000)
    motors.largeBC.setSpeed(0)
})
```