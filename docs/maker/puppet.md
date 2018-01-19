# Puppet

Use this program with the Programmable Brick and Large Motor.

```blocks
loops.forever(function () {
    motors.largeA.setSpeed(30)
    loops.pause(100)
    motors.largeA.stop()
    music.playSoundEffectUntilDone(sounds.animalsCatPurr)
    motors.largeA.setSpeed(-30)
    loops.pause(100)
    motors.largeA.stop()
})
```
