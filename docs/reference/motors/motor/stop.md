# stop

Stop the motor.

```sig
motors.largeA.stop()
```

The motor stops but any motion caused from previously running the motor continues until it runs down. If you are driving your brick and then stop the motors, it will coast for awhile before stopping. If you want the brick to stop right away, use ``||motors:set brake||`` to stop it.

## Example

Run the motor connected to port **A** for 2 seconds at a speed of `30`. Stop and wait for 2 seconds, then continue at a speed of `50`.

```blocks
motors.largeA.run(30)
pause(2000)
motors.largeA.stop()
pause(2000)
motors.largeA.run(50)
```

## See also

[set brake](/reference/motors/motor/set-brake), [reset](/reference/motors/motor/reset),