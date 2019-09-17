# Stop At Object

This is a code example to detect contact or collision with another object. It uses a touch sensor to detect hitting a wall or other obstacle. The motors are run and then stopped when the sensor is pressed.

```blocks
motors.largeBC.tank(50, 50)
sensors.touch1.pauseUntil(ButtonEvent.Pressed)
motors.largeBC.stop()
```