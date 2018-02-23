# color

Get the current color detected by the sensor.

```sig
sensors.color1.color()
```

The [color](/reference/sensors/color) value returned is one of the colors that the sensor can detect. If you want to use colors for tracking, it's best to use a color that is the same or very close to the ones the sensor detects.

## Returns

* a color value for the current color detected by the color sensor. The colors detected are:

>* ``none``: no color is detected.
>* ``blue``
>* ``green``
>* ``yellow``
>* ``red``
>* ``white``
>* ``brown``

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

[color](/reference/sensors/color-sensor/color)