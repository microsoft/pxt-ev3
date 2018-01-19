# is Pressed

```blocks
loops.forever(function () {
    if (sensors.touch1.isPressed()) {
        brick.setLight(BrickLight.Green)
    } else {
        brick.setLight(BrickLight.Orange)
    }
})
```