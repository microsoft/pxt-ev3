# Set Run Deceleration Ramp

```sig
motors.largeD.setRunDecelerationRamp(1, MoveUnit.Seconds)
```

## Examples

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeB.run(50, 6, MoveUnit.Rotations)
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    motors.largeC.run(50, 6, MoveUnit.Seconds)
})
motors.largeB.setRunAccelerationRamp(360, MoveUnit.Degrees)
motors.largeB.setRunDecelerationRamp(360, MoveUnit.Degrees)
motors.largeC.setRunAccelerationRamp(2, MoveUnit.Seconds)
motors.largeC.setRunDecelerationRamp(2, MoveUnit.Seconds)
```