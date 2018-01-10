# Light the way Activity 2

```blocks
sensors.color3.onLightChanged(LightIntensityMode.Ambient, LightCondition.Bright, function () {
    brick.clearScreen()
})
sensors.color3.onLightChanged(LightIntensityMode.Ambient, LightCondition.Dark, function () {
    brick.showImage(images.objectsLightOn)
})
```