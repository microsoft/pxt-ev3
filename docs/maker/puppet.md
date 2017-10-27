# Puppet

Use this program with the Programmable Brick and Large Motor.

```blocks
loops.forever(function () {
    output.largeMotorA.setPower(30)
    output.largeMotorA.on(true)
    loops.pause(100)
    output.largeMotorA.on(false)
    music.playSoundUntilDone(music.sounds(Sounds.PowerUp))
    output.largeMotorA.setPower(-30)
    output.largeMotorA.on(true)
    loops.pause(100)
    output.largeMotorA.on(false)
})
```
