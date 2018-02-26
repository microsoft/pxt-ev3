# pause Until

Make your program wait until a button event from a remote beacon happens.

```sig
sensors.remoteButtonBottomLeft.pauseUntil(ButtonEvent.Bumped);
```

An [infrared beacon][lego beacon] works with an infrared sensor connected to the @boardname@. The beacon sends a signal over infrared with information about button presses on the beacon. The infrared sensor receives the signal from the beacon and records a button event.

## Parameters

* **ev**: the beacon button action to wait for. The button actions (events) are:
> * ``pressed``: the button was pressed, or pressed and released
> * ``bumped``: the button was just bumped
> * ``released``: the button was just released

## ~hint

**Remote channel**

In order to recognize a button event signalled from a remote beacon, an infrared sensor must know what channel to listen on for messages from that beacon. An infrared sensor needs to set the channel first, then it can receive messages transmitted by the beacon. Before waiting for, or checking on an button event from a beacon, use [set remote channel](/reference/sensors/beacon/set-remote-channel).

## ~

## Example

Wait for a bump to beacon button `center` before continuing with displaying a message on the screen.

```blocks
let waitTime = 0;
brick.clearScreen();
brick.showString("We're going to wait", 1);
brick.showString("for you to bump the", 2);
brick.showString("touch sensor on port 1", 3);
waitTime = control.millis();
sensors.infrared1.setRemoteChannel(InfraredRemoteChannel.Ch0)
sensors.remoteButtonCenter.pauseUntil(ButtonEvent.Bumped);
brick.clearScreen();
if (control.millis() - waitTime > 5000) {
    brick.showString("Ok, that took awhile!", 1);
} else {
    brick.showString("Ah, you let go!", 1);
}
```

## See also

[on event](/reference/sensors/beacon/on-event)

[EV3 Infrared Beacon][lego beacon]

[lego beacon]: https://education.lego.com/en-us/products/ev3-infrared-beacon/45508