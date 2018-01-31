# pause Until

Causes your program to wait until an event at a button happens.

```sig
brick.buttonEnter.pauseUntil(ButtonEvent.Bumped);
```

## Parameters

* **ev**: the button action to wait for. The button actions (events) are:
> * ``click``: button was clicked (pressed and released)
> * ``up``: button is released from just being pressed
> * ``down``: button is just pressed down

## Example

Wait for the `up` button to go up before continuing with displaying a message on the screen.

```blocks
let waitTime = 0;
brick.showString("We're going to wait", 1);
brick.showString("for you to press and", 2);
brick.showString("release the UP button", 3);
waitTime = control.millis();
brick.buttonUp.pauseUntil(ButtonEvent.Bumped);
brick.clearScreen();
if (control.millis() - waitTime > 5000) {
    brick.showString("Ok, that took awhile!", 1)
} else {
    brick.showString("Ah, you let go!", 1)
}
```

## See also

[on event](/reference/brick/button/on-event)