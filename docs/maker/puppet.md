# Puppet

Use this program with the Programmable Brick and Large Motor.

```blocks
loops.forever(function () {
    output.largeMotorA.onForAngle(30, 30, false)
    music.playSoundUntilDone(music.sounds(Sounds.PowerUp))
    output.largeMotorA.onForAngle(40, -30, false)
})
```
