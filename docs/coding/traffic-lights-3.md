# Traffic Lights Activity 3

```blocks
forever(function () {
    if (sensors.color3.light(LightIntensityMode.Reflected) < 15) {
        motors.largeBC.tank(30, 12)
    } else {
        motors.largeBC.tank(12, 30)
    }
})
```