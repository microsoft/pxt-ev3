# Mission 2 Lesson

Use the program below to tell your robot how to solve the Crane Mission (Mission 2).

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(0, 25, 2.25, MoveUnit.Rotations)
    control.timer1.reset()
    while (control.timer1.seconds() < 1.5) {
        motors.largeBC.steer(sensors.color1.light(LightIntensityMode.Reflected) - 40, 50)
    }
    motors.largeBC.stop()
    motors.largeBC.steer(0, 15, 0.25, MoveUnit.Rotations)
    motors.mediumA.run(25, 60, MoveUnit.Degrees)
    pause(2000)
    motors.mediumA.run(-25, 1, MoveUnit.Seconds)
    motors.largeBC.steer(0, -100, 4, MoveUnit.Rotations)
})
motors.largeBC.setBrake(true)
```