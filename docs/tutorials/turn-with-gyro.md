# Turn With Gyro

## Introduction @fullscreen

Use the gyro to measure how much the robot is turning, regardless if your wheels are slipping.

## Step 1 Calibrate

Add the ``||sensors:calibrate gyro||`` block to make sure your gyro is ready to use.

```blocks
sensors.gyro2.calibrate()
```

## Step 2 Turn

Use motor blocks to make the robot turn. Don't go too fast!

```blocks
sensors.gyro2.calibrate()
motors.largeBC.steer(200, 20)
```

## Step 3 Pause for turn

Use the ``||sensors:pause until rotated||`` block to wait until the desired amount of rotation has occured.

```blocks
sensors.gyro2.calibrate()
motors.largeBC.steer(200, 20)
sensors.gyro2.pauseUntilRotated(90)
```

## Step 4 Stop

Stop the motors!

```blocks
sensors.gyro2.calibrate()
motors.largeBC.steer(200, 20)
sensors.gyro2.pauseUntilRotated(90)
motors.stopAll()
```