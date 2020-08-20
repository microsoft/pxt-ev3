# Ignition

Explore sensor events and sensor status.

## Activity 1

Wait for a touch sensor press or ultrasonic object detection. Show an expression on the screen when they happen.

```blocks
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.eyesDizzy)
})
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectDetected, function () {
    brick.showImage(images.eyesTiredMiddle)
})
brick.showImage(images.eyesSleeping)
```

## Activity 2

Play some motor sounds if touch sensor `1` is pressed at the same moment when and object comes close.

```blocks
while (true) {
    if (sensors.touch1.isPressed() &&
        sensors.ultrasonic4.distance() < 10) {
        music.playSoundEffectUntilDone(sounds.mechanicalMotorStart)
        music.playSoundEffectUntilDone(sounds.mechanicalMotorIdle);
    }
}
```

## Activity 3

Play some motor sounds if touch sensor `1` is pressed when both the `enter` button is pressed on the brick and an object comes close.

```blocks
while (true) {
    if (sensors.ultrasonic4.distance() < 10 &&
        sensors.touch1.isPressed() &&
        brick.buttonEnter.isPressed()) {
        music.playSoundEffectUntilDone(sounds.mechanicalMotorStart)
        music.playSoundEffectUntilDone(sounds.mechanicalMotorIdle);
    }
}
```