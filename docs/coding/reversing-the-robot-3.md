# Reversing the robot Activity 3

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    brick.showImage(images.eyesSleeping)
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    brick.showImage(images.eyesNeutral)
    motors.largeBC.run(50)
    sensors.touch2.pauseUntil(ButtonEvent.Pressed)
    brick.showImage(images.eyesTiredMiddle)
    motors.largeBC.run(0)
    pause(1000)
    brick.setStatusLight(StatusLight.OrangeFlash)
    brick.showImage(images.eyesDizzy)
    motors.largeBC.run(-50)
    pause(2000)
    motors.largeBC.run(0)
})
```