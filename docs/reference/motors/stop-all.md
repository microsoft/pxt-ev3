# stop All Motors

Stops all motors currently running on the brick.

```sig
motors.stopAll();
```

The motors stops but any motion caused from previously running the motors continues until it runs down. If you are driving your brick and then stop the motors, it will coast for awhile before stopping. 

## Example

Tank the EV3 Brick forward at half speed for 5 seconds and then stop.

```blocks
motors.largeAB.tank(50, 50);
pause(5000);
motors.stopAll();
```

## See also

[stop](/reference/motors/motor/stop), 
[reset](/reference/motors/motor/reset),
[reset-all](/reference/motors/motor/reset-all),
[set brake](/reference/motors/motor/set-brake)