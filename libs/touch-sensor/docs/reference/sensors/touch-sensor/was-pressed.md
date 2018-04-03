# was Pressed

See if a touch sensor was pressed since the last time it was checked.

```sig
sensors.touch1.wasPressed()
```

If a touch sensor was pressed, then that event is remembered. Once you check if a touch sensor **was pressed**, that status is set back to `false`. If you check again before the sensor is touched another time, the **was pressed** status is `false`. Only when the sensor is touched will the **was pressed** status go to `true`.

## Returns

* a [boolean](/types/boolean) value that is `true` if the sensor was pressed before. It's `false` if the sensor was not pressed.

## Example

If the touch sensor ``touch 1`` was pressed, show a `green` status light. Otherwise, set the status light to `orange`.

```typescript
forever(function () {
    if (sensors.touch1.wasPressed()) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
    pause(500)
})
```

## See also

[is pressed](/reference/sensors/touch-sensor/is-pressed), [on event](/reference/sensors/touch-sensor/on-event)