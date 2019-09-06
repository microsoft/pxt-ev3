# set Brake Settle Time

Set the time to wait after a motor stopped to allow it settle
when brake is enabled. Default is 10ms.

```sig
motors.largeA.setBrakeSettleTime(200)
```

When a the motor is stopped and brake is applied, it can still wiggle for a little while. You can use the settle time to automatically way after stopping and let the robot settle.

## Parameters

* **time**: a [number](/types/number) value which represents the number of milliseconds to wait after braking.

## Example

Set the brake mode and the settle time to 500ms. Run the motor connected to port **A** for 2 seconds at a speed of `30` and stop after 2s.

```blocks
motors.largeA.setBrake(true)
motors.largeA.setBrakeSettleTime(500)
motors.largeA.run(30)
pause(2000)
motors.largeA.stop()
```

## See also

[stop](/reference/motors/motor/stop)