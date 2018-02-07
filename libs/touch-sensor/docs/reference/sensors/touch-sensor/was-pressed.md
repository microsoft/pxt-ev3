# was Pressed

```blocks
loops.forever(function () {
    if (sensors.touch1.wasPressed()) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```