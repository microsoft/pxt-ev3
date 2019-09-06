# set Brake

Set the brake on the motor so it will brake when it finishes a brake command.

```sig
motors.largeA.setBrake(false)
```

When a the motor is stopped, it can still rotate if an external force is applied to it. This can happen, for example, if you're tanking your brick on a inclined surface and stop the motors. Gravity will push down on the brick and might cause it to start rolling again. You can prevent this movement by setting the brake.

Also, you can use the brake to do simple skid steering for your brick.

## Parameters

* **brake**: a [boolean](/types/boolean) value which is either `true` to set the brake on or `false` to set the brake off.

## Example

Run the motor connected to port **A** for 2 seconds at a speed of `30` and stop after 2s.

```blocks
motors.largeA.setBrake(true)
motors.largeA.run(30)
pause(2000)
motors.largeA.stop()
```

## See also

[stop](/reference/motors/motor/stop)