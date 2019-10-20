# Is Color Detected

Checks the color is detected

```sig
let b = sensors.color1.isColorDetected(ColorSensorColor.Blue)
```

The [color](/reference/sensors/color) you choose to look for is one of the colors that the sensor can detect. If you want to use colors for tracking, it's best to use a color that is the same or very close to the ones the sensor detects.

## Parameters

* **color**: the [color](/reference/sensors/color) to watch for.

## Example

Wait for the sensor to see ``blue``. Then, show an expression on the screen.

```blocks
brick.showString("Waiting for blue", 1)
while(!sensors.color1.isColorDetected(ColorSensorColor.Blue)) {
    pause(20)
}
brick.clearScreen()
brick.showImage(images.expressionsSick)
```

## See also

[on color detected](/reference/sensors/color-sensor/on-color-detected), [color](/reference/sensors/color)