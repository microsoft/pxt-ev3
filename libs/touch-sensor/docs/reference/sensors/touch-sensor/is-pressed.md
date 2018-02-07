# is Pressed

```blocks
loops.forever(function () {
    if (sensors.touch1.isPressed()) {
        brick.setStatusLight(BrickLight.Green)
    } else {
        brick.setStatusLight(BrickLight.Orange)
    }
})
```