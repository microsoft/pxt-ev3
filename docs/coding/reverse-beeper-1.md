# Reverse Beeper Activity 1

```blocks
loops.forever(function () {
    music.playTone(440, sensors.ultrasonic4.distance());
    loops.pause(50)
})
motors.largeBC.setSpeed(-20);
sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear);
motors.largeBC.stop();
```
