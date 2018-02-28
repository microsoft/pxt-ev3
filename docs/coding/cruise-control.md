# Cruise Control

Learn how to set and adjust motor speeds.

## Activity 1

Increase motor speed when touch sensor `1` is pressed.

```blocks
let speed = 0;
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    if (speed < 100)
        speed = speed + 10;
    motors.largeBC.run(speed);
}) 
```

## Activity 2

Add a "reduce" motor speed action when touch sensor `2` is pressed.

```blocks
let speed = 0;
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    if (speed < 100)
        speed = speed + 10;
    motors.largeBC.run(speed);
}) 
sensors.touch2.onEvent(ButtonEvent.Pressed, function () {
    if (speed > -100)
        speed = speed - 10;
    motors.largeBC.run(speed);
}) 
```

## Activity 3

Refactor your code by moving the speed increase and speed decrease code into ``||functions:accelerate||`` and ``||functions:decelerate||`` functions. Run the motors at the new speed in an ``||functions:update||`` function.

```blocks
let speed = 0
function decelerate() {
    if (speed > -100) {
        speed = speed - 10
    }
}
function accelerate() {
    if (speed < 100) {
        speed = speed + 10
    }
}
function update() {
    brick.clearScreen()
    brick.showString("speed: " + speed, 1)
    motors.largeBC.run(speed)
}
sensors.touch2.onEvent(ButtonEvent.Pressed, function () {
    accelerate()
    update()
})
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    decelerate()
    update()
})
```