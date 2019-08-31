# Pause Until Pressed

This is an example of code using a touch sensor to detect a wall or other obstacle. The motors are running until the sensor is pressed.

```blocks
motors.largeBC.tank(50, 50)
sensors.touch1.pauseUntil(ButtonEvent.Pressed)
motors.largeBC.stop()
```