# color

```blocks
loops.forever(function () {
    if (sensors.color1.color() == ColorSensorColor.Green) {
        brick.setStatusLight(BrickLight.Green)
    } else {
        brick.setStatusLight(BrickLight.Orange)
    }
})
```