# Reflected light calibration

The ``||sensors:calibrateLight||`` blocks allows you to calibrate the reflected light of the color sensor in one block. At the time you run the block, move the sensor over a dark surface and a bright surface; then stop moving it.

```blocks
sensors.color3.onLightDetected(LightIntensityMode.Reflected, Light.Dark, function () {
    brick.showString("dark", 2)
})
sensors.color3.onLightDetected(LightIntensityMode.Reflected, Light.Bright, function () {
    brick.showString("bright", 2)
})
console.sendToScreen()
console.log("move color sensor")
console.log("over DARK and BRIGHT color")
console.log("and stop moving when done")
console.log("press ENTER when ready")
brick.buttonEnter.pauseUntil(ButtonEvent.Pressed)
sensors.color3.calibrateLight(LightIntensityMode.Reflected)
brick.showValue("dark", sensors.color3.threshold(Light.Dark), 4)
brick.showValue("bright", sensors.color3.threshold(Light.Bright), 5)
forever(function () {
    brick.showValue("reflected light", sensors.color3.light(LightIntensityMode.Reflected), 1)
})
```