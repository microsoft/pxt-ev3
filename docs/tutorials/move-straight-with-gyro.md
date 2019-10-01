# Move Straight With Gyro

## Introduction @fullscreen

Rotating using a wheel is not precise. The wheel can slip or the motors
can be slightly different. 
With the help of the gyro you can detect and correct deviations in your trajectory.

* [EV3 Driving Base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)
* [EV3 Driving Base with Gyro](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-gyro-sensor-driving-base-a521f8ebe355c281c006418395309e15.pdf)


## Step 1 Calibration

Add a ``||sensors:calibrate gyro||`` block in a ``||brick:on button enter pressed||`` block so that you can manually start a calibration process. Run the calibration
at least once after connecting the gyro.

```blocks
brick.showPorts()
sensors.gyro2.calibrate()
```

## Step 2 Compute the error

Make a new **error** variable and drag the ``||sensors:gyro rate||``
and multiply it by -1. Since the rate shows the rotation rate, we will
counter it by negating it.

```blocks
let error = 0
brick.showPorts()
sensors.gyro2.calibrate()
while (true) {
    error = sensors.gyro2.rate() * -1
}
```

## Step 3 Steer with feedback

Drag a ``||motors:steer motors||`` block under the variable and pass
the **error** variable into the turn ratio section.

If the robot is turning right, the gyro will report a positive rotation rate
and the turn ratio will be negative which will the turn the robot left!

```blocks
let error = 0
brick.showPorts()
sensors.gyro2.calibrate()
while (true) {
    error = sensors.gyro2.rate() * -1
    motors.largeBC.steer(error, 50)
}
```

## Step 4 Run it!

Download to your brick and test out if the robot is going straight.

This kind of technique is called a proportional controller; 
it corrects the inputs (motor speed) with a feedback proportional to the output (rotation rate).