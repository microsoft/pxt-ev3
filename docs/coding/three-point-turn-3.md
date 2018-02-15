# Three Point Turn Activity 3

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    motors.largeBC.tank(75, 30)
    pause(1500)
    motors.largeBC.tank(-30, -75)
    sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear);
    motors.largeBC.tank(0, 0)
    music.playSoundEffect(sounds.animalsDogBark1)
    pause(1000)
    motors.largeBC.tank(50, 50)
    pause(3000)
})
```