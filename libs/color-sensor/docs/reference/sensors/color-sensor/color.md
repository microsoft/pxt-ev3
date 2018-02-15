# color

```blocks
forever(function () {
    if (sensors.color1.color() == ColorSensorColor.Green) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```