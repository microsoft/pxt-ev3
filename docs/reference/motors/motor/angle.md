# angle

Get the current angle of the motor's rotation in degrees.

```sig
motors.largeA.angle()
```

When a motor is started for the first time, or after a reset, it's angle of rotation starts at `0` degrees. A complete rotation (a turn in a full circle) is `360` degrees. At `360` degrees, the motor angle doesn't go back to `0` but keeps counting in degrees. So, one and a half turns adds up to `540` degrees of total rotation.

## Returns

* a [number](/types/number) which is the current angle of rotation for the motor.

## Example

Reset the motor connected to port **A** and run it for for 2 seconds at a speed of `45`. Stop and get the current angle of rotation.

```blocks
let motorAngle = 0;
motors.largeA.reset()
motors.largeA.run(45)
pause(2000)
motors.largeA.stop()
motorAngle = motors.largeA.angle()
```

## See also

[speed](/reference/motors/motor/speed),
[reset](/reference/motors/motor/reset), [clear counts](/reference/motors/motor/clear-counts)