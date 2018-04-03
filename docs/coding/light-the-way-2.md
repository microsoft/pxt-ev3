# Light the way Activity 2

```blocks
sensors.color3.onLightDetected(LightIntensityMode.Ambient, Light.Bright, function () {
    brick.clearScreen()
})
sensors.color3.onLightDetected(LightIntensityMode.Ambient, Light.Dark, function () {
    brick.showImage(images.objectsLightOn)
})
```