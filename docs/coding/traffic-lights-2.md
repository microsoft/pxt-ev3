# Traffic Lights Activity 2

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Red, function () {
    motors.largeBC.tank(0, 0)  
})
sensors.color3.onColorDetected(ColorSensorColor.Green, function () {
    motors.largeBC.tank(20, 20)
})
```