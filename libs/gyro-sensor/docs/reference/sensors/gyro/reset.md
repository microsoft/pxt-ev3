# reset

Reset the zero reference for the gyro to current position of the brick.

```sig
sensors.gyro2.reset()
```

To make the gyro measure rotation angle from the current position of the brick, it is recalibrated. That is, the brick's current position is set to `0` degrees and rotation angle measurements start from there.

## ~hint

The current position is considered to be the [_horizon_](https://en.wikipedia.org/wiki/Attitude_indicator) or a place that is the _plane of reference_ (this is possibly someplace that's flat for a horizontal reference).

## ~

## ~hint

**Important**

To properly reset the gyro, the brick must remain still (undistrurbed) while the reset operation takes place.

## ~

## Calibration states

The calibration is divided in the following phases and can be tracked via the brick status light.

* **orange**: sensor initialization. This phase ensures that the sensor is in the desired mode and ready to collect data.
* **orange pulse**: data collection. Light information is being collected, move the sensor over the various light sources to detect.
* **green**: calibration success. The calibration data has been saved
* **red flash**: sensor failure. We were unable to connect to the sensor.

## Example
Set the brick on a flat surface. Reset `gyro 2` and tilt the brick slighly. Reset it again while it's still tilted. Lay the brick down flat again and display the angle measurement.

```blocks
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    sensors.gyro2.reset()
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    brick.showNumber(sensors.gyro2.angle(), 1)
})
```

## See also

[angle](/reference/sensors/gyro/angle), [rate](/reference/sensors/gyro/rate)