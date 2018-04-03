# on Color Detected

Run some code when the color you want to watch for is detected.

```sig
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () { })
```

The [color](/reference/sensors/color) you choose to look for is one of the colors that the sensor can detect. If you want to use colors for tracking, it's best to use a color that is the same or very close to the ones the sensor detects.

## Parameters

* **color**: the [color](/reference/sensors/color) to watch for.
* **handler**: the code you want to run when the color is detected.

## Example

Show an expression on the screen when the color sensor ``color 1`` sees ``blue``.

```blocks
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () {
    brick.showImage(images.expressionsSick)
})
```
## See also

[pause until color detected](/reference/sensors/color-sensor/pause-until-color-detected), [color](/reference/sensors/color)