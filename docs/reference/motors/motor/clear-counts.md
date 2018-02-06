# clear Counts

Set all counters for the motor back to zero.

```sig
motors.largeA.clearCounts()
```

The counters for a motor are: **tacho**, **angle**, and **speed**. Each of these counters is set to start counting from `0` again. This is a way to begin new counts without having to stop the motor or reset it.

## Example

See if the motor turns the same number of times for each of two count periods. Run the motor connected to port **A** twice for 10 seconds and compare the tacho counts.

```blocks
let tachoCount = 0;
motors.largeA.reset()
motors.largeA.setSpeed(50)
loops.pause(10000)
tachoCount = motors.largeA.tacho()
tachoCount = motors.largeA.clearCounts()
motors.largeA.setSpeed(50)
loops.pause(10000)
if (tachoCount == motors.largeA.tacho()) {
    brick.showString("Motor turns equal.), 1)
} else {
    brick.showString("Motor turns NOT equal.), 1)
}
motors.largeA.stop()
```

## See also

[tacho](/refernce/motors/motor/tacho), [angle](/refernce/motors/motor/tacho),
[speed](/refernce/motors/motor/speed), [reset](/reference/motors/motor/reset)