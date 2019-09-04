# Ramp

Schedules an acceleration, constant and deceleration phase at a given speed.

```sig
motors.largeA.ramp(50, 100, 500, 100)
```

The speed setting is a percentage of the motor's full speed. Full speed is the speed that the motor runs when the brick supplies maximum output voltage to the port.


## Parameters

* **speed**: a [number](/types/number) that is the percentage of full speed. A negative value runs the motor in the reverse direction.
* **acceleration**: the [number](/types/number) of movement units to rotate for while accelerating.
* **value**: the [number](/types/number) of movement units to rotate for.
* **deceleration**: the [number](/types/number) of movement units to rotate for while decelerating.
* **unit**: the movement unit of rotation. This can be `milliseconds`, `seconds`, `degrees`, or `rotations`. If the number for **value** is `0`, this parameter isn't used.

## Example

This is an interactive program that lets you change the values of 
the acceleration and deceleration and see the effects.

```blocks
let steady = 0
let dec = 0
let acc = 0
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    acc += -100
})
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeB.ramp(50, steady, MoveUnit.MilliSeconds, acc, dec)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    acc += 100
})
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    dec += 100
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    dec += -100
})
acc = 500
steady = 1000
acc = 500
forever(function () {
    brick.showValue("acc", acc, 1)
    brick.showValue("steady", steady, 2)
    brick.showValue("dec", dec, 3)
    brick.showString("acc: left/right", 5)
    brick.showString("dec: up/down", 6)
    brick.showString("run large B: enter", 7)
})
```

## See also

[tank](/reference/motors/synced/tank), [steer](/reference/motors/synced/steer), [stop](/reference/motors/motor/stop)