# speed

Get the current speed of motor rotation as a percentage of maximum speed.

```sig
motors.largeA.speed()
```

The actual speed of the motor is the same or very close to it's current speed setting when the motor is regulated. If not regulated, the actual speed can change from the speed you told it to run at (your desired or _set point_ speed) when a force, or load, is applied to it.

## Returns

* a [number](/types/number) which is the motor's current speed. This value is a percentage of maximum speed from `0` to `100`. This number is negative, like `-27`, if the direction of rotation is in reverse.

## Example

Turn speed regulation off and report the actual speed of the large motor in the forward direction. Occasionally touch the wheel on the motor to see if it changes the speed.

```blocks
motors.largeA.setRegulated(false)
motors.largeA.run(55)
brick.showString("Actual speed:", 1)
for (let i = 0; i < 30; i++) {
    pause(500)
    brick.showNumber(motors.largeA.speed(), 3)
}
motors.largeA.stop()
```

## See also

[speed](/reference/motors/motor/speed),
[reset](/reference/motors/motor/reset), [clear counts](/reference/motors/motor/clear-counts)