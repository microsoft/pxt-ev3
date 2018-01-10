# Ignition Activity 1

```blocks
sensors.touch1.onEvent(TouchSensorEvent.Pressed, function () {
    brick.showImage(images.eyesDizzy)
})
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectDetected, function () {
    brick.showImage(images.eyesTiredMiddle)
})
brick.showImage(images.eyesSleeping)
```
