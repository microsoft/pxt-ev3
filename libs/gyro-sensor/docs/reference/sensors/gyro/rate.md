# rate

Get the current rotation rate from the gyro.

```sig
sensors.gyro2.rate()
```

When the brick is in motion, it moves in the direction of one of axes used to measure three-dimensional space. Depending on where the gyro sensor is attached, it can measure the difference in angle from where it was before the last motion occurred. While the brick is moving the angle differences are measured continuously. This gives a rate of change in angle from one point in time to the next. This rate of change is measured as how many degrees of angle change in one second (degrees per second). This also known as _roll rate_ or _angular velocity_.


## Returns

* a [number](/types/number) that is the current rate of rotation in degrees per second.

## ~hint

## Accuracy and calibration

Gyro sensors aren't perfectly accurate. Sometimes, because of temperature and changes in the way electricity behaves in the sensor, the gyro returns a small error in it's measurement. This causes the gyro sensor to return an incorrect value for the amount of angle it detected. This might make your robot drive off course and not go to where you want it to.

### Drift

If you want to turn the tank or robot you built to the left by 45 degrees, you might run the motor on the right side until the gyro reported that you turned by 45 degrees. What if the gyro was getting an error of 4 degrees every time it measured an angle? You may have actually turned 49 degrees when you expected to turn 45 degrees. Well, that might not be too bad if you use the gyro's angle value only once. It's fine if you just wanted to turn and stop or drive a short distance in only that direction.

The problem is that when you need to read the angle measurement frequently, the amount of error in the angle measurement may continue to increase. If the sensor thought it moved by 45 degrees the first time instead of really 49 degrees, your second turn will put you at 98 degrees when the sensor said 90 degrees. If you want a robot to turn right 90 degrees and drive for 5 meters, it might actually turn 98 degrees and drive 0.7 meters off course before it stops. This error in the sensor's measurement is called _drift_.

### Calibration

If errors in the angle values returned by the gyro sensor are making your project not work right, then it's time to **[reset](/reference/sensors/gyro/reset)**. A reset will return the gyro sensor's current angle value back to `0` and _calibrate_ for drift. Calibration is the process of finding out how much error there is in a sensor's measurement and then removing the error from the value returned to your program.

Are you using a gyro sensor in your project and need accuracy for your angle values? You should reset the gyro sensor at a regular intervals to improve precision in the values reported to your program.

## ~

## Example

Flash the status light to red if the roll rate of `gyro 2` is more that `30` degrees per second.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.gyro2.reset()
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    sensors.gyro2.calibrate()
})
forever(function () {
    brick.showNumber(sensors.gyro2.rate(), 2)
    if (sensors.gyro2.rate() > 30) {
        brick.setStatusLight(StatusLight.RedFlash)
    } else {
        brick.setStatusLight(StatusLight.Off)
    }
})
```

## See also

[angle](/reference/sensors/gyro/angle), [reset](/reference/sensors/gyro/reset)