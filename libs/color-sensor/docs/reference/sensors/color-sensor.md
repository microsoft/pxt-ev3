# Color sensor

```cards
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () {})
sensors.color1.onLightDetected(LightIntensityMode.Reflected, Light.Dark, function () {})
sensors.color1.pauseUntilLightDetected(LightIntensityMode.Reflected, Light.Dark)
sensors.color1.pauseUntilColorDetected(ColorSensorColor.Blue)
sensors.color1.color();
sensors.color1.light(LightIntensityMode.Ambient)
```

## See slso

[on color detected](/reference/sensors/color-sensor/on-color-detected),
[pause until color detected](/reference/sensors/color-sensor/pause-until-color-detected),
[on light detected](/reference/sensors/color-sensor/on-light-detected),
[pause until light detected](/reference/sensors/color-sensor/pause-until-light-detected),
[color](/reference/sensors/color-sensor/color),
[light](/reference/sensors/color-sensor/ambient-light)
