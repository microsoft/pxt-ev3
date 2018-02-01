# reset

Reset the motor's rotation value and an movement unit.

```sig
motors.largeA.reset()
```

## Example

Use the current rotation settings for the motor at port **A** for 2 seconds at a speed of `30`. Stop and wait for 2 seconds, then change the rotation to run at a speed of `50` for `7` full rotations.

```blocks
motors.largeA.setSpeed(30)
loops.pause(2000)
motors.largeA.stop()
loops.pause(2000)
motors.largeA.setSpeed(50, 7, MoveUnit.Rotations)
```

## See also

[stop](/reference/motors/motor/stop)