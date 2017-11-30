# color

```blocks
loops.forever(function () {
    if (sensors.colorSensor1.color() == ColorSensorColor.Green) {
        brick.setStatusLight(LightsPattern.Green)
    } else {
        brick.setStatusLight(LightsPattern.Orange)
    }
})
```