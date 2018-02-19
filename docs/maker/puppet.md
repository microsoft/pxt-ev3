# Puppet

Use this program with the Programmable Brick and Large Motor.

```blocks
forever(function () {
    motors.largeA.run(30)
    pause(100)
    motors.largeA.stop()
    music.playSoundEffectUntilDone(sounds.animalsCatPurr)
    motors.largeA.run(-30)
    pause(100)
    motors.largeA.stop()
})
```
