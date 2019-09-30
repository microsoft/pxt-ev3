# Calibrate Gyro

## Introduction @fullscreen

The gyroscope is a very useful sensor in the EV3 system. It detects the rotation rate
which can be very useful to correct the trajectory of the robot and do precise turns.

However, the sensor can be imprecise and subject to drifting. It is recommend to
calibrate your sensor at least once after starting your brick. You don't have to 
recalibrate on every run.

* [EV3 Driving Base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)
* [EV3 Driving Base with Gyro](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-gyro-sensor-driving-base-a521f8ebe355c281c006418395309e15.pdf)


## Step 1 Calibration

Add a ``||sensors:calibrate gyro||`` block in a ``||brick:on button enter pressed||`` block so that you can manually start a calibration process.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.gyro2.calibrate()
})
```

## Step 2 Download and run @fullscreen

Download this program to your brick and press the ENTER button.