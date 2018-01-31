# Reversing the robot Activity 1

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    motors.largeBC.setSpeed(50)
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    motors.largeBC.setSpeed(0)
    loops.pause(1000)
    brick.setLight(BrickLight.OrangeFlash)
    motors.largeBC.setSpeed(-50)
    loops.pause(2000)
    motors.largeBC.setSpeed(0)
})
```