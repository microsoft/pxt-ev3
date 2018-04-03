# pause Until Light Condition Detected

Wait until a particular light condition is detected.

```sig
sensors.color1.pauseUntilLightDetected(LightIntensityMode.Reflected, Light.Dark)
```

You can wait for a change in either _ambient_ or _reflected_ light. This event happens when the sensor detects light going to ``dark`` or to ``bright``. You choose what condition you will wait for.

## Parameters

* **mode**: lighting mode to use for detection. This is for either ``ambient`` or ``reflected`` light.
* **condition**: the condition that the light changed to: ``dark`` or ``bright``.

## Example

Wait for the ambient light to go dark, then show an expression on the screen.

```blocks
brick.showString("Waiting for dark", 1)
sensors.color1.pauseUntilLightDetected(LightIntensityMode.Reflected, Light.Dark)
brick.clearScreen()
brick.showImage(images.expressionsSick)
```

## See also

[on light detected](/reference/sensors/color-sensor/on-light-detected)