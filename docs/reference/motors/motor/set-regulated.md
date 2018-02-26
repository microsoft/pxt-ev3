# set Regulated

Tell a motor to regulate its speed or not.

```sig
motors.largeA.setRegulated(true)
```

In order for a motor to always rotate at a constant speed it needs regulation. This means that the motor control electronics need to continously measure how much rotation has happened. The controller takes several rotation counts for a small amount of time and compares them to see if the speed is changing. The output power is adjusted if the controller detects that the motor is running too slow or too fast.

If it's not regulated, your motor can change from the speed that you've set for it. Some examples are if your brick is driving forward and bumps into an object or it drives up a slope creating more load on the motor. In theses situations, if your motor speed is regulated, the controller will boost the power to the motor to keep it's speed from slowing down. Another example is when you run the motors to drive your brick down a slope. In this case, the motors would go faster than the speed you set for them if not regulated. To regulate this the controller reduces the power output to the motors to keep the brick from going faster.

Motor regulation is always set to **ON** when your program first starts or the motor is reset.

## Paramters

* **value**: a [boolean](/types/boolean) value which means that the motor speed is regulated if `true`. The motor speed is not regulated when this is `false`.

## Example

Turn off the speed regulation for the motor connected to port **A**.

```blocks
motors.largeA.setRegulated(false)
motors.largeA.run(75)
pause(20000)
motors.largeA.stop()
```

## See also

[run](/reference/motors/motor/run), [stop](/reference/motors/motor/stop)
