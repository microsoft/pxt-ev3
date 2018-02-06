# set Brake

Set the brake on the motor so it won't turn when it has no power.

```sig
motors.largeA.setBrake(false)
```

When a the motor is stopped, it can still rotate if an external force is applied to it. This can happen if your're tanking your brick on a inclined surface and stop the motors. Gravity will push down on the brick and might cause it to start rolling again. You can prevent this movement by setting the brake.

Also, you can use the brake to do simple skid steering for your brick.

## Paramters

* **brake**: a [boolean](/types/boolean) value which is either `true` to set the brake on or `false` to set the brake off.

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