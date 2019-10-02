# Pause Until Rotated

Pauses the program until the gyro sensors detect that the desired amount of rotation
has been acheived.

```
sensors.gyro2.pauseUntilRotated(90)
```

## Example

This program performs a square turn left, then right.

```blocks
sensors.gyro2.calibrate()
motors.largeBC.steer(200, 10)
sensors.gyro2.pauseUntilRotated(90)
motors.largeBC.steer(-200, 10)
sensors.gyro2.pauseUntilRotated(-90)
motors.largeBC.stop()
```