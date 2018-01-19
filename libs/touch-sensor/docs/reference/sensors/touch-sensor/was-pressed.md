# was Pressed

```blocks
loops.forever(function () {
    if (sensors.touch1.wasPressed()) {
        brick.setLight(BrickLight.Green)
    } else {
        brick.setLight(BrickLight.Orange)
    }
})
```