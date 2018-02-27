# @extends

## Example #example

Stop the program if the gyro dectects an angle greater than 45 degrees.

```blocks
forever(function () {
    control.assert(sensors.gyro2.angle() > 45, 15)
    pause(300)
})
```