# reset

Reset the elapsed time of the timer back to `0`.

```sig
control.timer1.reset()
```

A timer starts counting from `0` when your program starts. It's time value always gets larger as your program runs. Maybe you want to meausure how long some task takes to finish or you want to do some action  only for a little while. A timer can keep track of the time it takes to do it.

Resetting the timer sets the time value to `0` so the next time you check the time it's exactly the amount of time that has _elapsed_. Otherwise, you need to remember a start time value and then subtract it from the current time. 

## Examples

### Press time

Find out how much time goes by between presses of the `enter` button on the brick.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showValue("PressTime", control.timer1.seconds(), 1)
    control.timer1.reset()
})
```

### Difference timer

Use a difference timer and compare it to a timer that resets. Use the ``left`` button to start timing and the ``right`` button to stop.

```blocks
let startTime = 0
let timing = false
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    brick.clearScreen()
    brick.showString("Starting timers...", 1)
    startTime = control.timer1.seconds()
    control.timer2.reset()
    timing = true
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    if (timing) {
        brick.clearScreen()
        brick.showString("Timer results...", 1)
        brick.showValue("timer 1", control.timer1.seconds() - startTime, 3)
        brick.showValue("timer 2", control.timer2.seconds(), 4)
        timing = false;
    }
})
```