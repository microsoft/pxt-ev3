# Set Run Phase

Allows to specify an acceleration or deceleration phases for run commands.

```sig
motors.largeD.setRunPhase(MovePhase.Acceleration, 1, MoveUnit.Seconds)
```

Once the run phase is specified on a motor (or pair of motors),
it will be automatically applied to [run](/reference/motors/run) commands.

## Time vs Rotation

The phases specified for time units (seconds, milliseconds) only apply to run with time
moves. Similarly, the phases specified for rotation units (# rotation, degrees) only
apply to run with rotation units.

## Examples

```blocks
motors.largeB.setRunPhase(MovePhase.Acceleration, 0.5, MoveUnit.Seconds)
motors.largeB.setRunPhase(MovePhase.Deceleration, 0.2, MoveUnit.Seconds)
forever(function () {
    motors.largeB.run(50, 1, MoveUnit.Seconds)
})
```