# on Event

Run some code when a remote beacon button is pressed, bumped, or released.

```sig
sensors.remoteButtonBottomLeft.onEvent(ButtonEvent.Bumped, function () {});
```

An [infrared beacon][lego beacon] works with an infrared sensor connected to the @boardname@. The beacon sends a signal over infrared with information about button presses on the beacon. The infrared sensor receives the signal from the beacon and records a button event.

## Parameters

* **ev**: the beacon button action to run some code for. The button actions (events) are:
> * ``pressed``: the button was pressed, or pressed and released
> * ``bumped``: the button was just bumped
> * ``released``: the button was just released
* **body**: the code you want to run when something happens to the beacon button.

## ~hint

**Remote channel**

In order to recognize a button event signalled from a remote beacon, an infrared sensor must know what channel to listen on for messages from that beacon. An infrared sensor needs to set the channel first, then it can receive messages transmitted by the beacon. Before waiting for, or checking on an button event from a beacon, use [set remote channel](/reference/sensors/beacon/set-remote-channel).

## ~

## Example

Check for an event on beacon button sensor ``center``. Put an expression on the screen when the button is released.

```blocks
sensors.infrared1.setRemoteChannel(InfraredRemoteChannel.Ch0)
sensors.remoteButtonCenter.onEvent(ButtonEvent.Released, function () {
    brick.showImage(images.expressionsSick)
})
```

### See also

[is pressed](/reference/sensors/beacon/is-pressed),
[was pressed](/reference/sensors/beacon/was-pressed),
[pause until](/reference/sensors/beacon/pause-until)

[EV3 Infrared Beacon][lego beacon]

[lego beacon]: https://education.lego.com/en-us/products/ev3-infrared-beacon/45508