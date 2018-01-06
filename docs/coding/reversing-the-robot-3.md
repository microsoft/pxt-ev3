# Reversing the robot Activity 3

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Click, function () {
    brick.showImage(images.eyesSleeping)
    sensors.touchSensor1.pauseUntil(TouchSensorEvent.Pressed)
    brick.showImage(images.eyesNeutral)
    motors.largeBC.setSpeed(50)
    sensors.touchSensor2.pauseUntil(TouchSensorEvent.Pressed)
    brick.showImage(images.eyesTiredMiddle)
    motors.largeBC.setSpeed(0)
    loops.pause(1000)
    brick.setLight(LightsPattern.OrangeFlash)
    brick.showImage(images.eyesDizzy)
    motors.largeBC.setSpeed(-50)
    loops.pause(2000)
    motors.largeBC.setSpeed(0)
})
```