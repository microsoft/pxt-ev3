# reset

Reset the gyro sensor.

```sig
sensors.gyro2.reset()
```

To make the gyro measure rotation angle from the current position of the brick, it is recalibrated. That is, the brick's current position is set to `0` degrees and rotation angle measurements start from there.

This function only resets the sensor; if you wish to have progress indication and a more robust calibration sequence, use [calibrate](/reference/gyro-sensor/calibrate).

## ~hint

The current position is considered to be the [_horizon_](https://en.wikipedia.org/wiki/Attitude_indicator) or a place that is the _plane of reference_ (this is possibly someplace that's flat for a horizontal reference).

## ~

## ~hint

**Important**

To properly reset the gyro, the brick must remain still (undisturbed) while the reset operation takes place.

## ~

## Example
Set the brick on a flat surface. Reset `gyro 2` and tilt the brick slightly. Reset it again while it's still tilted. Lay the brick down flat again and display the angle measurement.

```blocks
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    sensors.gyro2.reset()
})
forever(function() {
    brick.showNumber(sensors.gyro2.angle(), 1)
})
```

## See also

[angle](/reference/sensors/gyro/angle), [rate](/reference/sensors/gyro/rate)
