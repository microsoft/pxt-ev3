# battery Property

Return the information about the battery

```sig
brick.batteryInfo(BatteryProperty.Level)
```

## Parameters

* property: the kind of information

## Returns

* a [number](/types/number) which represents the value of the property requested.

## Example

Show the battery level percentage on the screen. Also, show a green light if the battery level is above 15%. If the battery level is below 15% but above 5%, show a orange light. But, if the battery level is below 5%, show a pulsing red light.

```blocks
let battery = 0;
forever(function() {
    brick.showString("Battery level:", 1)
    brick.showNumber(battery, 2)
    battery = brick.batteryInfo(BatteryProperty.Level);
    if (battery > 15)
    {
        brick.setStatusLight(StatusLight.Green);
    } else if (battery > 5) {
        brick.setStatusLight(StatusLight.Orange);
    } else {
        brick.setStatusLight(StatusLight.RedPulse)
    }
    pause(30000)
})
```

Or see all the values

```blocks
forever(function () {
    brick.showValue("bat V", brick.batteryInfo(BatteryProperty.Voltage), 1)
    brick.showValue("bat %", brick.batteryInfo(BatteryProperty.Level), 2)
    brick.showValue("bat I", brick.batteryInfo(BatteryProperty.Current), 3)
})
```