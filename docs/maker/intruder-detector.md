# Intruder Detector

This program will activate an alarm when an object moves in front of the Ultrasonic Sensor.

TODO support for event when value changes

```blocks
input.ultrasonic4.onObjectNear(function () {
    music.playSoundUntilDone(music.sounds(Sounds.PowerUp))
})
```