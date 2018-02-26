# pause Until

Make your program wait until an event at a touch sensor happens.

```sig
sensors.touch1.pauseUntil(ButtonEvent.Bumped);
```

## Parameters

* **ev**: the touch sensor action to wait for. The touch actions (events) are:
> * ``pressed``: the sensor was pressed, or pressed and released
> * ``bumped``: the sensor was just bumped
> * ``released``: the sensor was just released

## Example

Wait for a bump to touch sensor `touch 1` before continuing with displaying a message on the screen.

```blocks
let waitTime = 0;
brick.showString("We're going to wait", 1);
brick.showString("for you to bump the", 2);
brick.showString("touch sensor on port 1", 3);
waitTime = control.millis();
sensors.touch1.pauseUntil(ButtonEvent.Bumped);
brick.clearScreen();
if (control.millis() - waitTime > 5000) {
    brick.showString("Ok, that took awhile!", 1)
} else {
    brick.showString("Ah, you let go!", 1)
}
```

## See also

[on event](/reference/sensors/touch-sensor/on-event)