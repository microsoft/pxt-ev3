# Reverse Beeper Activity 2

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
