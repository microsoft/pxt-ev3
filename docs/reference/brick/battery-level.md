# battery Level

Return the current battery level.

```sig
brick.batteryLevel();
```

## Returns

* a [number](/types/number) which is the current charge level of the brick's battery. This is a percentage of total charge left in the battery.

## Example

Show the battery level percentage on the screen. Also, show a green light if the battery level is above 15%. If the battery level is below 15% but above 5%, show a orange light. But, if the battery level is below 5%, show a pulsing red light.

```blocks
let battery = 0;
loops.forever(function() {
    brick.showString("Battery level:", 1)
    brick.showNumber(battery, 2)
    battery = brick.batteryLevel();
    if (battery > 15)
    {
        brick.setLight(BrickLight.Green);
    } else if (battery > 5) {
        brick.setLight(BrickLight.Orange);
    } else {
        brick.setLight(BrickLight.RedPulse)
    }
    loops.pause(30000)
})
```