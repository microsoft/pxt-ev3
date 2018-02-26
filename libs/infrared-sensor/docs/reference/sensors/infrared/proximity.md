# proximity

Get the promixity of an object measured by the infrared sensor.

```sig
sensors.infrared1.proximity();
```

The proximity value returned is a number between `0` and `100` which is a _relative_ measurment of  distance to an object. A value of `0` means something is very close and `100` means something is far away. The proximity is determined by the amount of infrared light reflected back by an object. The proximity value for an object that has a lighter color and smooth surface will be less than an object at the same distance with a darker color and a rough surface.

Proximity isn't an actual measurement units of distance, like in centimeters or meters, but it gives you an idea whether something is close or not so close.

## Returns

* a [number](/types/number) that is `0` for (very near) to `100` (far). The value is relative to the range of the infrared sensor.

## Example

When the infrared sensor on port 4 detects a near object, display its proximity value on the screen.

```blocks
sensors.infrared4.onEvent(InfraredSensorEvent.ObjectNear, function () {
    brick.clearScreen()
    brick.showValue("proximity", sensors.infrared4.proximity(), 1)
})
```

## See also

[on event](/reference/sensors/infrared/on-event), [pause until](/reference/sensors/infrared/pause-until)