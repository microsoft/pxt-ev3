# angle

Get the current rotation angle of the gyro.

```sig
sensors.gyro2.rate()
```

When the brick changes its position, it's moved in the direction of one of the axes used to measure three-dimensional space. Depending on where the gyro sensor is attached, it can measure the difference in angle from where it was before it moved. This angle is measured in degrees. The angle is the number of degrees rotated from where the gyro was last [reset](/reference/sensors/gyro/reset).

## Returns

* a [number](/types/number) that is the current angle of rotation in degrees.

## Example

Turn the brick and press ENTER to see the current rotation angle of `gyro 2`.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showNumber(sensors.gyro2.angle(), 1)
})
```

## See also

[rate](/reference/sensors/gyro/rate), [reset](/reference/sensors/gyro/reset)