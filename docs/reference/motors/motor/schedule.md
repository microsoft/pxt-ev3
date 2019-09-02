# Schedule

Schedules an acceleration, constant and deceleration phase at a given speed.

```sig
motors.largeA.schedule(50, 100, 500, 100)
```

The speed setting is a percentage of the motor's full speed. Full speed is the speed that the motor runs when the brick supplies maximum output voltage to the port.


## Parameters

* **speed**: a [number](/types/number) that is the percentage of full speed. A negative value runs the motor in the reverse direction.
* **acceleration**: the [number](/types/number) of movement units to rotate for while accelerating.
* **value**: the [number](/types/number) of movement units to rotate for.
* **deceleration**: the [number](/types/number) of movement units to rotate for while decelerating.
* **unit**: the movement unit of rotation. This can be `milliseconds`, `seconds`, `degrees`, or `rotations`. If the number for **value** is `0`, this parameter isn't used.

## See also

[tank](/reference/motors/synced/tank), [steer](/reference/motors/synced/steer), [stop](/reference/motors/motor/stop)