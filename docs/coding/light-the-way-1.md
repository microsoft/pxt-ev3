# Light the way Activity 1

```blocks
sensors.color3.onLightDetected(LightIntensityMode.Ambient, Light.Dark, function () {
    brick.showImage(images.objectsLightOn)
    pause(5000)
    brick.clearScreen()
})
```