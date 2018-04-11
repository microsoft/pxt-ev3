# Movement Detector

This program will activate an alarm when an object moves in front of the Ultrasonic Sensor.

```blocks
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    music.playSoundEffectUntilDone(sounds.informationActivate)
})
```