# rate

Get the current rotation rate from the gyro.

```sig
sensors.gyro2.rate()
```

When the brick is in motion, it moves in the direction of one of axes used to measure three-dimensional space. Depending on where the gyro sensor is attached, it can measure the difference in angle from where it was before the last motion occurred. While the brick is moving the angle differences are measured continuously. This gives a rate of change in angle from one point in time to the next. This rate of change is measured as how many degrees of angle change in one second (degrees per second). This also known as _roll rate_ or _angular velocity_.


## Returns

* a [number](/types/number) that is the current rate of rotation in degrees per second.

## Example

Flash the status light to red if the roll rate of `gyro 2` is more that `30` degrees per second.

```blocks
loops.forever(function () {
    if (sensors.gyro2.rate() > 30) {
        brick.setStatusLight(StatusLight.RedFlash)
    } else {
        brick.setStatusLight(StatusLight.Off)
    }
})
```

## See also

[angle](/reference/sensors/gyro/angle), [reset](/reference/sensors/gyro/reset)