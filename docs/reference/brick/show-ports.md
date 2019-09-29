# show Ports

Show the status of everything connected to the ports.

```sig
brick.showPorts()
```

You can find out what's connected to the ports on the brick and show its status. The status information from each sensor or motor connected is displayed on the screen.

## Example

Show the status of the ports on the brick. Resets all motors when ENTER is pressed.

```blocks
brick.showPorts()
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.resetAll()
})
```

## See also

[show string](/reference/brick/show-string), [show value](/reference/brick/show-value)