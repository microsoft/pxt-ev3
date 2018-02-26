# Sound Machine

This example program combined with the small model will make a beat and rhythm on any surface when the program is run.

```blocks
forever(function () {
    motors.largeA.run(50)
    pause(200)
    motors.largeA.run(100)
    pause(200)
})
``` 