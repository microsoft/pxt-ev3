# Security Gadget

This program will activate an alarm when an object is lifted from the Touch Sensor.

```blocks
sensors.touch1.onEvent(TouchSensorEvent.Released, function () {
    music.playSoundEffectUntilDone(sounds.informationActivate);
})
```