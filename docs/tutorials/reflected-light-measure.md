# Reflected light measure

This example uses a color sensor to measure the reflected light from a dark and light surface
and sets the light/dark thresholds.

```blocks
sensors.color3.onLightDetected(LightIntensityMode.Reflected, Light.Dark, function () {
    brick.showString("dark", 2)
})
sensors.color3.onLightDetected(LightIntensityMode.Reflected, Light.Bright, function () {
    brick.showString("bright", 2)
})
console.sendToScreen()
console.log("move color sensor")
console.log("over DARK color")
console.log("press ENTER when ready")
brick.buttonEnter.pauseUntil(ButtonEvent.Pressed)
sensors.color3.setThreshold(Light.Dark, sensors.color3.light(LightIntensityMode.Reflected) + 5)
console.logValue("dark", sensors.color3.threshold(Light.Dark))
console.log("move color sensor")
console.log("over BRIGHT color")
console.log("press ENTER when ready")
brick.buttonEnter.pauseUntil(ButtonEvent.Pressed)
sensors.color3.setThreshold(Light.Bright, sensors.color3.light(LightIntensityMode.Reflected) - 5)
console.logValue("bright", sensors.color3.threshold(Light.Bright))
forever(function () {
    brick.showValue("reflected light", sensors.color3.light(LightIntensityMode.Reflected), 1)
})
```