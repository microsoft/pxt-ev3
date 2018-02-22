# pauseUntil

Pause until the timer counts up to a number of milliseconds.

```sig
control.timer1.pauseUntil(0)
```

When code in a block comes to a **pauseUntil**, it will wait until the timer count reaches the number of milliseconds you say. Code in blocks like **forever** and **runInParallel** will keep running while the current code is paused.

The time number you give is the number of milliseconds past the running timer count. If the timer is currently at `25000` milliseconds and you want to pause for `10` seconds, then use a pause time of `35000`. If you want your pause time number to match the actual wait time, then [reset](/reference/control/timer/reset) the timer first.

## Parameters

* **ms**: the [number](/types/number) of milliseconds that you want the timer to count up to. For seconds, convert to milliseconds: 100 milliseconds = 1/10 second and 1000 milliseconds = 1 second.

## Example

Pause between messages on the screen by `5` seconds.

```blocks
brick.clearScreen()
brick.showString("Testing my pause...", 1)
let startTime = control.timer1.millis()
brick.showValue("StartTime", startTime, 3)
control.timer1.pauseUntil(startTime + 5000)
brick.showValue("EndTime", control.timer1.millis() - startTime, 4)
```

## See also

[millis](/reference/control/timer/millis), [reset](/reference/control/timer/reset)
