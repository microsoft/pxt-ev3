# Light the way Activity 3

```blocks
sensors.color3.onLightChanged(LightIntensityMode.Ambient, LightCondition.Bright, function () {
    brick.clearScreen()
})
sensors.color3.onLightChanged(LightIntensityMode.Ambient, LightCondition.Dark, function () {
    brick.showImage(images.objectsLightOn)
})
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.objectsLightOn);
})
```