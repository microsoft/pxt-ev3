# was Pressed

See if a button on a remote infrared beacon was pressed since the last time it was checked.

```sig
sensors.remoteButtonBottomLeft.wasPressed()
```

An [infrared beacon][lego beacon] works with an infrared sensor connected to the @boardname@. The beacon sends a signal over infrared with information about button presses on the beacon. The infrared sensor receives the signal from the beacon and records a button event.

If a button was pressed, then that event is remembered. Once you check if a beacon button **was pressed**, that status is set back to `false`. If you check again before the beacon button is pressed another time, the **was pressed** status is `false`. Only when the button is pressed will the **was pressed** status go to `true`.

## Returns

* a [boolean](/types/boolean) value that is `true` if the beacon button was pressed before. It's `false` if the button was not pressed.

## Example

If the beacon button ``top left`` was pressed, show a `green` status light. Otherwise, set the status light to `orange`.

```blocks
forever(function () {
    if (sensors.remoteButtonTopLeft.wasPressed()) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
    pause(500)
})
```

## See also

[is pressed](/reference/sensors/beacon/is-pressed), [on event](/reference/sensors/beacon/on-event)

[EV3 Infrared Beacon][lego beacon]

[lego beacon]: https://education.lego.com/en-us/products/ev3-infrared-beacon/45508