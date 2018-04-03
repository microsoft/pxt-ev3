# Light the way Activity 3

```blocks
sensors.color3.onLightDetected(LightIntensityMode.Ambient, Light.Bright, function () {
    brick.clearScreen()
})
sensors.color3.onLightDetected(LightIntensityMode.Ambient, Light.Dark, function () {
    brick.showImage(images.objectsLightOn)
})
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.objectsLightOn);
})
```