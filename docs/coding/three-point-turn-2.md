# Three Point Turn Activity 2

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Click, function () {
    motors.largeBC.tank(75, 30)
    loops.pause(1500)
    motors.largeBC.tank(-30, -75)
    sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear);
    motors.largeBC.tank(0, 0)
    loops.pause(1000)
    motors.largeBC.tank(50, 50)
    loops.pause(3000)
})
```