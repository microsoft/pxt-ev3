# Coast Or Brake

```blocks
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    // tell motor to brake once the run command is done
    motors.largeB.setBrake(true)
    motors.largeB.run(100, 1, MoveUnit.Rotations)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    // tell motor to coast once the run command is done
    motors.largeB.setBrake(false)
    motors.largeB.run(100, 1, MoveUnit.Rotations)
})
```