# Three Point Turn Activity 3

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Click, function () {
    motors.largeBC.tankFor(75, 30, 1.5, MoveUnit.Seconds)
    motors.largeBC.pauseUntilReady()
    motors.largeBC.tank(-30, -75)
    sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear);
    motors.largeBC.tank(0, 0)
    music.playSoundEffect(sounds.animalsDogBark1)
    loops.pause(1000)
    motors.largeBC.tankFor(50, 50, 3, MoveUnit.Seconds);    
    motors.largeBC.pauseUntilReady()
})
```