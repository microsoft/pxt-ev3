# is Pressed

Check to see if a touch sensor is currently pressed or not.

```sig
sensors.touch1.isPressed()
```
## Returns

* a [boolean](/types/boolean) value that is `true` if the sensor is currently pressed. It's `false` if the sensor is not pressed.

## Example

If the touch sensor ``touch 1`` is pressed, show a `green` status light. Otherwise, set the status light to `orange`.

```blocks
forever(function () {
    if (sensors.touch1.isPressed()) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```

## See also

[was pressed](/reference/sensors/touch-sensor/was-pressed), [on event](/reference/sensors/touch-sensor/on-event)