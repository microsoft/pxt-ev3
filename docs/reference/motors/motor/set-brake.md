# set Brake

Set the brake on the motor so it won't turn when it has no power.

```sig
motors.largeA.setBrake(false)
```

## Paramters

* **brake**: a [boolean](/reference/types/boolean) value which is either `false` to set the brake off or `true` to set the brake on.

## Example

Run the motor connected to port **A** for 2 seconds at a speed of `30`. Stop and set the brake.

```blocks
motors.largeA.setSpeed(30)
loops.pause(2000)
motors.largeA.stop()
motors.largeA.setBrake(true)
```

## See also

[stop](/reference/motors/motor/stop)