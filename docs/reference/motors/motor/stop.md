# stop

Set the motor rotation.

```sig
motors.largeA.stop()
```

## Example

Run the motor connected to port **A** for 2 seconds at a speed of `30`. Stop and wait for 2 seconds, then continue at a speed of `50`.

```blocks
motors.largeA.setSpeed(30)
loops.pause(2000)
motors.largeA.stop()
loops.pause(2000)
motors.largeA.setSpeed(50)
```

## See also

[reset](/reference/motors/motor/reset)