# tacho

Get the current number of rotations of the motor.

```sig
motors.largeA.tacho()
```

The _tacho_ count is the number of times the motor has turned a complete circle which is a rotation of `360` degrees. The tacho count starts at `0` when the motor runs fo the first time or after a reset.

## ~hint

**Measure RPM**

A standard way to know how fast a motor is turning is by measuring its _revolutions per minute_ (rpm). One revolution is the same thing as a rotation, or one turn. How do you measure rpm? Well, here's a simple way:

1. Record the current tacho count
2. Run the motor for 60 seconds
3. Get the tacho count again
4. Subtract the first tacho count from the second one

## ~

## Returns

* a [number](/types/number) which is the count of rotations that the motor has turned since it was first started or reset.

## Example

Run the motor connected to port **A** at half speed for 5 seconds. Display the number of rotations on the screen.

```blocks
motors.largeA.setSpeed(50)
loops.pause(5000)
motors.largeA.stop()
brick.showString("Motor rotations:", 1)
brick.showNumber(motors.largeA.tacho(), 3)
motors.largeA.setSpeed(50)
```

## See also

[angle](/reference/motors/motor/tacho), [speed](/reference/motors/motor/speed),
[reset](/reference/motors/motor/reset), [clear counts](/reference/motors/motor/clear-counts)
