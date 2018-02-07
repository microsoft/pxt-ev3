# is Pressed

```blocks
loops.forever(function () {
    if (sensors.touch1.isPressed()) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```