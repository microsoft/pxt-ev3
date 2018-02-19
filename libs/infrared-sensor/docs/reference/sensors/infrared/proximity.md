# proximity

Get the promixity measured by the infrared sensor, from ``0`` (close) to ``100`` (far).

```sig
sensors.infraredSensor1.proximity();
```

The proximity value returned is a number between `0` and `100` which is a relative measurment of  distance to an object. That means, if the sensor can measure distances up to 50 centimeters, then a proximity value of `25` says that an object is 12.5 centimeters away. You can set an object at a fixed distance from the sensor and measure it with a tape measure. Then, find the out what proximity value is for that same distance. You now have a number to _correlate_ to distance. In the example, the proximity value of `25` means 12.5 centimeters. So, each proximity value means (25 / 12.5) centimeters which is 2 centimeters per proximity value.

## Returns

* a [number](/types/number) that is `0` for (very near) to `100` (far). The value is relative to the range of the infrared sensor.

## Example

When the infrared sensor on port 4 detects a near object, display its proximity value on the screen.

```blocks
sensors.infraredSensor4.onEvent(InfraredSensorEvent.ObjectNear, function () {
    brick.showString("Object detected at:", 1)
    brick.showNumber(sensors.infraredSensor4.proximity(), 2)
    brick.showString("centimeters", 3)
})
```

## See also

[on event](/reference/sensors/infrared/on-event), [pause until](/reference/sensors/infrared/pause-until)