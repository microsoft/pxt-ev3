# reset All Motors

Reset all motors currently running on the brick.

```sig
motors.resetAll();
```

The motors counters are resetted. 

## Example

Tank the EV3 Brick forward at half speed for 5 seconds and then stop.

```blocks
motors.largeAB.tank(50, 50);
pause(5000);
motors.stopAll();
motors.resetAll();
```

## See also

[stop all](/reference/motors/motor/stop-all), 
[reset](/reference/motors/motor/reset)
