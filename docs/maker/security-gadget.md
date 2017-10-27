# Security Gadget

This program will activate an alarm when an object is lifted from the Touch Sensor.

```blocks
input.touchSensor1.onEvent(TouchSensorEvent.Released, function () {
    music.playSoundUntilDone(music.sounds(Sounds.PowerUp))
})
```