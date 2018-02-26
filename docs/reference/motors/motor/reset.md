# reset

Reset the motor's speed setting and it's counters.

```sig
motors.largeA.reset()
```

The motor's speed is set back to `0` and the **tacho**, **angle**, and **speed** counters are set to `0`.

## Example

See what the angle count is when a motor is stopped. Then, try it again after a reset.

```blocks
motors.largeA.run(30)
pause(2000)
motors.largeA.stop()
brick.showString("Angle count:", 1)
brick.showNumber(motors.largeA.angle(), 2)
motors.largeA.run(30)
pause(2000)
motors.largeA.reset()
brick.showString("Angle count:", 4)
brick.showNumber(motors.largeA.angle(), 5)
```

## See also

[stop](/reference/motors/motor/stop), [clear counts](/reference/motors/motor/clear-counts)