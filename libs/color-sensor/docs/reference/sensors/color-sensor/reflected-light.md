# Reflected Light

```blocks
loops.forever(function () {
    if (sensors.color1.reflectedLight() > 20) {
        brick.setLight(BrickLight.Green)
    } else {
        brick.setLight(BrickLight.Orange)
    }
})
```