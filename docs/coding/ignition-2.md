# Ignition Activity 2

```blocks
while (true) {
    if (sensors.touch1.wasPressed() &&
        sensors.ultrasonic4.distance() < 10) {
        music.playSoundEffectUntilDone(sounds.mechanicalMotorStart)
        music.playSoundEffectUntilDone(sounds.mechanicalMotorIdle);
    }
    loops.pause(1);
}
```
