# Color sensor

```cards
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () {})
sensors.color1.onLightChanged(LightIntensityMode.Reflected, LightCondition.Dark, function () {})
sensors.color1.pauseUntilLightConditionDetected(LightIntensityMode.Reflected, LightCondition.Dark)
sensors.color1.pauseUntilColorDetected(ColorSensorColor.Blue)
sensors.color1.color();
sensors.color1.light(LightIntensityMode.Ambient)
```

## See slso

[on color detected](/reference/sensors/color-sensor/on-color-detected),
[pause until color detected](/reference/sensors/color-sensor/pause-until-color-detected),
[on light changed](/reference/sensors/color-sensor/on-light-changed),
[pause until light condition detected](/reference/sensors/color-sensor/pause-until-light-condition-detected),
[color](/reference/sensors/color-sensor/color),
[light](/reference/sensors/color-sensor/ambient-light)
