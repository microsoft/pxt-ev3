# Traffic Lights Activity 1

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Click, function () {
    motors.largeBC.tank(20, 20)
    sensors.color3.pauseForColor(ColorSensorColor.Red)
    motors.largeBC.tank(0, 0)
})
```