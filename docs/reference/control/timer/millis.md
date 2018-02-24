# millis

Get the amount of time counted by the timer in milliseconds.

The timer count begins from `0` when you program starts or is [reset](/reference/control/timer/reset). 

## Returns

* a [number](/types/number) that is the amount of time elapsed, in milliseconds, since the timer was started or reset.

## Example

Find out how many milliseconds go by between presses of the `down` button on the brick.

```blocks
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    brick.showValue("DownButtonTime", control.timer1.millis(), 1)
    control.timer1.reset()
})
```

## See also

[seconds](/reference/control/timer/seconds), [reset](/reference/control/timer/reset)

