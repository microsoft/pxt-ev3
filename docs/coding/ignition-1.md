# Ignition Activity 1

```blocks
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.eyesDizzy)
})
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectDetected, function () {
    brick.showImage(images.eyesTiredMiddle)
})
brick.showImage(images.eyesSleeping)
```
