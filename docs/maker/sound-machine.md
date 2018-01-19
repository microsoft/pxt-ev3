# Sound Machine

This example program combined with the small model will make a beat and rhythm on any surface when the program is run.

```blocks
loops.forever(function () {
    motors.largeA.setSpeed(50)
    loops.pause(200)
    motors.largeA.setSpeed(100)
    loops.pause(200)
})
``` 