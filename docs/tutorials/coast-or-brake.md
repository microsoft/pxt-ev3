# Coast or Brake

This code example will set the brake when button **A** is pressed or let the motor coast (turn freely when not running) when button **B** is pressed. The motor is turned by one rotation to cause motion.

```blocks
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    // tell motor to brake once the run command is done
    motors.largeB.setBrake(true)
    motors.largeB.run(100, 1, MoveUnit.Rotations)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    // tell motor to coast once the run command is done
    motors.largeB.setBrake(false)
    motors.largeB.run(100, 1, MoveUnit.Rotations)
})
```