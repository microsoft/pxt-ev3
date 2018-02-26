# Color sensor

```cards
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () {})
sensors.color1.onLightChanged(LightIntensityMode.Reflected, LightCondition.Dark, function () {})
sensors.color1.pauseForLight(LightIntensityMode.Reflected, LightCondition.Dark)
sensors.color1.pauseForColor(ColorSensorColor.Blue)
sensors.color1.color();
sensors.color1.light(LightIntensityMode.Ambient)
```

## See slso

[on color detected](/reference/sensors/color-sensor/on-color-detected),
[pause for color](/reference/sensors/color-sensor/pause-for-color),
[on light changed](/reference/sensors/color-sensor/on-light-changed),
[pause for light](/reference/sensors/color-sensor/pause-for-light),
[color](/reference/sensors/color-sensor/color),
[light](/reference/sensors/color-sensor/ambient-light)
