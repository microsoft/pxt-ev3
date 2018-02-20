# Cruise Control Activity 1

```blocks
let speed = 0;
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    if (speed < 100)
        speed = speed + 10;
    motors.largeBC.run(speed);
}) 
```