# set Reversed

Change the direction of rotation for a motor.

```sig
motors.largeA.setInverted(true)
```

You use a positive value (some number greater than `0`) to drive you motor in the default direction. If you're using a motor in a way that makes more sense for your program to use a negative speed setting for that direction, you can reverse the speed range.

## Paramters

* **reversed**: a [boolean](/types/boolean) value that is `false` if the motor will use a speed value between `0` and `100` to turn in the default direction. If `true`, the motor uses a speed value between `0` and `-100` to turn in the default direction.

## Example

Run the motor connected to port **A** for 2 seconds at a speed of `30`. Stop and switch the direciton of rotation. Run the motor at a speed of `-30`. Watch and see if the motor turns in the same direction as before.

```blocks
motors.largeA.run(30)
pause(2000)
motors.largeA.stop()
pause(2000)
motors.largeA.setInverted(true)
motors.largeA.run(-30)
pause(2000)
motors.largeA.stop()
```

## See also

[stop](/reference/motors/motor/stop)