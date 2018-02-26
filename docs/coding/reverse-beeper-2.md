# Reverse Beeper Activity 2

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
