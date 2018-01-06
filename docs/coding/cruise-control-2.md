# Cruise Control Activity 2

```blocks
let speed = 0;
sensors.touch1.onEvent(TouchSensorEvent.Pressed, function () {
    if (speed < 100)
        speed = speed + 10;
    motors.largeBC.setSpeed(speed);
}) 
sensors.touch2.onEvent(TouchSensorEvent.Pressed, function () {
    if (speed > -100)
        speed = speed - 10;
    motors.largeBC.setSpeed(speed);
}) 
```