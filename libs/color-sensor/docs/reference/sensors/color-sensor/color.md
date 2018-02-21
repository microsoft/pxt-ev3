# color

```sig
sensors.color1.color()
```

## Returns

* a color value for the current color detected by the color sensor.

## Example

Turn the status light to ``green`` if the color detected by the ``color 1`` sensor is green.

```blocks
forever(function () {
    if (sensors.color1.color() == ColorSensorColor.Green) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```

## See also

[color](/reference/sensors/color/color)