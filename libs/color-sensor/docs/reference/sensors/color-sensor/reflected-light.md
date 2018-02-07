# Reflected Light

```blocks
loops.forever(function () {
    if (sensors.color1.reflectedLight() > 20) {
        brick.setStatusLight(BrickLight.Green)
    } else {
        brick.setStatusLight(BrickLight.Orange)
    }
})
```