# On Color Detected

Run some code when the color you want to watch for is detected.

```sig
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () { })
```

# Parameters
## Parameters

* **color**: the [color](/reference/sensors/color) to watch for.
> * ``detected``: some other object is sending out infrared light
> * ``near``: the sensor detected something within the distance of the near threshold
* **handler**: the code you want to run when the color is detected.

## Example


```blocks
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () {
    brick.showImage(images.expressionsSick)
})
```
