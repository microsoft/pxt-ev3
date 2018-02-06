# tank

Rotate two motors in synchronization.

```sig
motors.largeAB.tank(50, 50)
```

Tanking the brick will drive two motors in synchronization. This means that both motors will start at the same time. Also, each motor uses the same amount of rotation when running at the same speed. You can use different speed values for each motor to perform turns or spins.

You set a _drive ratio_ between each motor by using different speeds.

## Parameters

* **speedLeft**: a number that is the percentage of full speed for attached to the left of the brick.
* **speedRight**: a number that is the percentage of full speed for attached to the right of the brick.
* **value**: the number of movement units to rotate for.
* **unit**: the movement unit of rotation. This can be `milliseconds`, `seconds`, `degrees`, or `rotations`.

## See also

[steer](/reference/motors/synced/steer), [set speed](/reference/motors/motor/set-speed)