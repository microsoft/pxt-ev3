# Ambient Light

```blocks
loops.forever(function () {
    if (sensors.color1.ambientLight() > 20) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```