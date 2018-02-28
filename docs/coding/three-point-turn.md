# Three Point Turn

Make three point turns by "tanking" the @boardname@.

## Activity 1

Tank the wheels at different speeds to make the turn.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    motors.largeBC.tank(75, 30)
    pause(1500)
    motors.largeBC.tank(-30, -75)
    pause(1000)
    motors.largeBC.tank(50, 50)
    pause(3000)
})
```

## Activity 2

Turn until the brick gets near something. Then, wait for a second and charge ahead!

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    motors.largeBC.tank(75, 30)
    pause(1500)
    motors.largeBC.tank(-30, -75)
    sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear);
    motors.largeBC.tank(0, 0)
    pause(1000)
    motors.largeBC.tank(50, 50)
    pause(3000)
})
```
## Activity 3

Do **Activity 2** again but let the dogs out this time!

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