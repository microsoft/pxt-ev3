# Reverse Beeper

Play with running the motors in reverse and making alert sounds.

## Activity 1

Start off by playing a "reverse alert" sound. Run the brick backward until it gets close to something.

```blocks
forever(function () {
    music.playTone(440, sensors.ultrasonic4.distance());
    pause(50)
})
motors.largeBC.run(-20);
sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear);
motors.largeBC.stop();
```

## Activity 2

Play the alert sound while the brick is reversing and gets close to something.

```blocks
forever(function () {
    if (motors.largeB.speed() != 0 && sensors.ultrasonic4.distance() < 20) {
        music.playTone(440, sensors.ultrasonic4.distance());
        pause(50)
    }
})
motors.largeBC.run(-20);
sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear);
motors.largeBC.stop();
```

## Activity 3

Have one task for driving backward and another for playing the "reverse alert" sound.

```blocks
let beep = false
beep = true
control.runInParallel(function () {
    motors.largeBC.run(-20)
    sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear)
    motors.largeBC.stop()
    beep = false
})
control.runInParallel(function () {
    while (beep) {
        if (sensors.ultrasonic4.distance() < 20) {
            music.playTone(440, sensors.ultrasonic4.distance())
            pause(50)
        }
    }
})
```
