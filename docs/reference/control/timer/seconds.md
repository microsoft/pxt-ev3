# seconds

Get the amount of time counted by the timer in seconds.

The timer count begins from `0` when you program starts or is [reset](/reference/control/timer/reset). The number of seconds returned also includes milliseconds if there is a fractional part of a second too.

## Returns

* a [number](/types/number) that is the amount of time elapsed, in seconds, since the timer was started or reset.

## Example

Find out how many seconds go by between presses of the `down` button on the brick.

```blocks
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    brick.showValue("DownButtonTime", control.timer1.seconds(), 1)
    control.timer1.reset()
})
```

## See also

[millis](/reference/control/timer/millis), [reset](/reference/control/timer/reset)

