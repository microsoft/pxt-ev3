# Light the way

Use the light sensor to notice when it goes dark or gets lighter around the brick.

## Activity 1

When the light goes dark, put the ``light on`` image on the screen for `5` seconds.

```blocks
sensors.color3.onLightChanged(LightIntensityMode.Ambient, LightCondition.Dark, function () {
    brick.showImage(images.objectsLightOn)
    pause(5000)
    brick.clearScreen()
})
```

## Activity 2

Notice when the light goes dark and put the ``light on`` image on the screen. If the light is bright, clear the screen.

```blocks
sensors.color3.onLightChanged(LightIntensityMode.Ambient, LightCondition.Bright, function () {
    brick.clearScreen()
})
sensors.color3.onLightChanged(LightIntensityMode.Ambient, LightCondition.Dark, function () {
    brick.showImage(images.objectsLightOn)
})
```

## Activity 3

Add a touch event to **Activity 2**.

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