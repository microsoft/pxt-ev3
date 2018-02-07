# was Pressed

```blocks
loops.forever(function () {
    if (sensors.touch1.wasPressed()) {
        brick.setStatusLight(BrickLight.Green)
    } else {
        brick.setStatusLight(BrickLight.Orange)
    }
})
```