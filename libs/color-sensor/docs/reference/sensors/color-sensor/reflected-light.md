# Reflected Light

```blocks
loops.forever(function () {
    if (sensors.colorSensor1.reflectedLight() > 20) {
        brick.setStatusLight(LightsPattern.Green)
    } else {
        brick.setStatusLight(LightsPattern.Orange)
    }
})
```