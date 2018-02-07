# tacho

Get the current number of degress of rotation.

```sig
motors.largeA.tacho()
```

The motors that come with your @boardname@ have a way to detect their own turning motion. They count the amount of motor rotation in degrees. The motor will count each degree of angle rotation up to 360 degrees for a full rotation. As the motor continues to turn, the _tacho_ count keeps adding up the degrees even past one full rotation. So, if the motor makes 3 complete rotations, the count will be 1080.

The name _tacho_ comes from the first part of the word [tachometer](https://en.wikipedia.org/wiki/Tachometer) which is a device to measure how fast something is turning. The motor controller in the brick uses the tacho count to regulate the motor's speed.

## ~hint

**Measure RPM**

A standard way to know how fast a motor is turning is by measuring its _revolutions per minute_ (rpm). One revolution is the same thing as a rotation, or one turn. How do you measure rpm? Well, here's a simple way:

1. Record the current tacho count
2. Run the motor for 60 seconds
3. Get the tacho count again
4. Subtract the first tacho count from the second one
5. Divide that number by `360`

## ~

## Returns

* a [number](/types/number) which is the total count of degrees of rotation that the motor has turned since it was first started or reset.

## Example

Run the motor connected to port **A** at half speed for 5 seconds. Display the number of full rotations on the screen.

```blocks
motors.largeA.setSpeed(50)
loops.pause(5000)
motors.largeA.stop()
brick.showString("Motor rotations:", 1)
brick.showNumber(motors.largeA.tacho() / 360, 3)
motors.largeA.setSpeed(50)
```

## See also

[angle](/reference/motors/motor/tacho), [speed](/reference/motors/motor/speed),
[set regulated](/reference/motors/motor/set-regulated),
[reset](/reference/motors/motor/reset), [clear counts](/reference/motors/motor/clear-counts)
