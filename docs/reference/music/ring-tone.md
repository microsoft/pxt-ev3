# @extends

## Example #example

This program checks the speed from the large `A` motor and uses the speed to adjust a tone it rings.

```blocks
loops.forever(function () {
    music.ringTone(motors.largeA.speed() * 100)
})
```