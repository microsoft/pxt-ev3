# color

```blocks
loops.forever(function () {
    if (sensors.color1.color() == ColorSensorColor.Green) {
        brick.setLight(BrickLight.Green)
    } else {
        brick.setLight(BrickLight.Orange)
    }
})
```