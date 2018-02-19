# Reverse Beeper Activity 1

```blocks
forever(function () {
    music.playTone(440, sensors.ultrasonic4.distance());
    pause(50)
})
motors.largeBC.run(-20);
sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear);
motors.largeBC.stop();
```
