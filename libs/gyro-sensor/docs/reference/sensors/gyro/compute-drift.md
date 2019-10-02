# compute Drift

Called when the sensor is completely still, computes the current rate drift
```sig
sensors.gyro2.computeDrift()
```

The gyroscope sensor is subject to rate drifting. This means that the measurement reported by the sensor is off by a few degrees per second over time: it is drifting.

To counter the effect of drifting, call the ``||sensors:compute drift||`` block when the sensor is still to compute the current drift. The rate meansurements will automatically be corrected based on that drift.

## Example

This example uses a gyro sensor to 

```blocks
let error = 0
sensors.gyro2.computeDrift()
while (sensors.color3.color() != ColorSensorColor.White) {
    error = sensors.gyro2.rate() * -1
    motors.largeBC.steer(error, 50)
}
motors.stopAll()
pause(1000)
sensors.gyro2.computeDrift()
while (sensors.color3.color() != ColorSensorColor.Blue) {
    error = sensors.gyro2.rate() * -1
    motors.largeBC.steer(error, 50)
}
motors.stopAll()
```

## See Also

[rate](/reference/sensors/gyro/rate),
[compute drift](/reference/sensors/gyro/compute-drift)

