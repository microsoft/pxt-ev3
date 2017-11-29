# was Pressed

```blocks
loops.forever(function () {
    if (sensors.touchSensor1.wasPressed()) {
        brick.setStatusLight(LightsPattern.Green)
    } else {
        brick.setStatusLight(LightsPattern.Orange)
    }
})
```