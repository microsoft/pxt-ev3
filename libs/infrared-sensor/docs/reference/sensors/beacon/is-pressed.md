# is Pressed

Check to see if a remote beacon button is currently pressed or not.

```sig
sensors.remoteButtonBottomLeft.isPressed()
```

An [infrared beacon][lego beacon] works with an infrared sensor connected to the @boardname@. The beacon sends a signal over infrared with information about button presses on the beacon. The infrared sensor receives the signal from the beacon and records a button event.

## Returns

* a [boolean](/types/boolean) value that is `true` if the beacon button is currently pressed. It's `false` if the button is not pressed.

## ~hint

**Remote channel**

In order to recognize a button event signalled from a remote beacon, an infrared sensor must know what channel to listen on for messages from that beacon. An infrared sensor needs to set the channel first, then it can receive messages transmitted by the beacon. Before waiting for, or checking on an button event from a beacon, use [set remote channel](/reference/sensors/beacon/set-remote-channel).

## ~

## Example

If the beacon button ``center`` is pressed, show a `green` status light. Otherwise, set the status light to `orange`.

```blocks
sensors.infrared1.setRemoteChannel(InfraredRemoteChannel.Ch0)
forever(function () {
    if (sensors.remoteButtonCenter.isPressed()) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```

## See also

[was pressed](/reference/sensors/beacon/was-pressed), [on event](/reference/sensors/beacon/on-event)

[EV3 Infrared Beacon][lego beacon]

[lego beacon]: https://education.lego.com/en-us/products/ev3-infrared-beacon/45508