# Traffic Lights

Use color and light to control the motion of the @boardname@.

## Activity 1

Drive forward and then stop when you reach the ``red`` color.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    motors.largeBC.tank(20, 20)
    sensors.color3.pauseForColor(ColorSensorColor.Red)
    motors.largeBC.tank(0, 0)
})
```

 ## Activity 2

Stop on the ``red`` color and go on the ``green``.

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Red, function () {
    motors.largeBC.tank(0, 0)  
})
sensors.color3.onColorDetected(ColorSensorColor.Green, function () {
    motors.largeBC.tank(20, 20)
})
```

## Activity 3

Turn in one direction or the other when reflected light is dim or bright.

```blocks
forever(function () {
    if (sensors.color3.light(LightIntensityMode.Reflected) < 15) {
        motors.largeBC.tank(30, 12)
    } else {
        motors.largeBC.tank(12, 30)
    }
})
```