# steer

Steer the brick in one direction using a drive ratio between two motors.

```sig
motors.largeAB.steer(0, 0)
```

Steering the brick will drive two motors in synchronization. This means that both motors will start at the same time. Also, each motor uses the same amount of rotation at the same speed. You set a _drive ratio_ between each motor for a certain speed to make the brick steer in one direction.

## Parameters

* **turnRatio**: a number that is the percentage of full speed for attached to the left of the brick.
* **speed**: a number that is the percentage of full speed for attached to the right of the brick.
* **value**: the number of movement units to rotate for.
* **unit**: the movement unit of rotation. This can be `milliseconds`, `seconds`, `degrees`, or `rotations`.

## See also

[tank](/reference/motors/synced/steer), [set speed](/reference/motors/motor/set-speed)