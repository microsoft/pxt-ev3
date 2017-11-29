# is Pressed

```blocks
loops.forever(function () {
    if (sensors.touchSensor1.isPressed()) {
        brick.setStatusLight(LightsPattern.Green)
    } else {
        brick.setStatusLight(LightsPattern.Orange)
    }
})
```