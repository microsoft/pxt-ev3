# stop All Motors

Stops all motors currently running on the brick.

```sig
motors.stopAllMotors();
```

## Example

Tank the @boardname@ forward at half speed for 5 seconds and then stop.

```blocks
motors.largeAB.tank(50, 50);
loops.pause(5000);
motors.stopAllMotors();
```

## See also

[stop](/reference/motors/motor/stop), 
[reset](/reference/motors/motor/reset)