# speed

Get the current speed of the motor's rotation as a percentage.

```sig
motors.largeA.speed()
```

When a motor is started for the first time, or after a reset, it's angle of rotation starts at `0` degrees. A complete rotation (a turn in a full circle) is `360` degrees. At `360` degrees, the motor angle gets set back to `0`. So, one and a half turns adds up to `540` degrees of total rotation but the motor only cares about the current angle from `0` degrees which is `180` degrees.

## Returns

* a [number](/reference/types/number) which is the current angle of rotation for the motor. The value returned is the number of degrees from `0` to `359`.

## Example

Reset the motor connected to port **A** and run it for for 2 seconds at a speed of `45`. Stop and get the current angle of rotation.

```blocks
let motorAngle = 0;
motors.largeA.reset()
motors.largeA.setSpeed(45)
loops.pause(2000)
motors.largeA.stop()
motorAngle = motors.largeA.angle()
```

## See also

[tacho](/reference/motors/motor/tacho), [speed](/reference/motors/motor/speed),
[reset](/reference/motors/motor/reset), [clear counts](/reference/motors/motor/clear-counts)