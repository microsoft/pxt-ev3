# Ignition Activity 3

```blocks
while (true) {
    if (sensors.ultrasonic4.distance() < 10 &&
        sensors.touch1.wasPressed() &&
        brick.buttonEnter.wasPressed()) {
        music.playSoundEffectUntilDone(sounds.mechanicalMotorStart)
        music.playSoundEffectUntilDone(sounds.mechanicalMotorIdle);
    }
    loops.pause(1);
}
```
