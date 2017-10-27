# Sound Machine

This example program combined with the small model will make a beat and rhythm on any surface when the program is run.

```blocks
loops.forever(function () {
    output.motorA.on(50)
    loops.pause(200)
    output.motorA.on(100)
    loops.pause(200)
})
``` 