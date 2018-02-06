# set Speed

Set the rotation speed of a single motor.

```sig
motors.largeA.setSpeed(50)
```

## Parameters

* **speed**: a number that is the percentage of full speed.
* **value**: the number of movement units to rotate for.
* **unit**: the movement unit of rotation. This can be `milliseconds`, `seconds`, `degrees`, or `rotations`.

## Example

Run the motor connected to port **A** for 20 seconds and then stop.

```blocks
motors.largeA.setSpeed(75)
loops.pause(20000)
motors.largeA.stop()
```

## See also

[tank](/reference/motors/synced/tank), [steer](/reference/motors/synced/steer), [stop](/reference/motors/motor/stop)