# distance

The distance of an object detected by the ultrasonic sensor.

```sig
sensors.ultrasonic1.distance()
```

The distance value returned is the number of centimeters to the object that the sensor is currently detecting.

## Returns

* a [number](/types/number) that is the distance of the object detected by the ultrasonic sensor in centimeters.


## Example

When the ultrasonic sensor on port 4 detects a near object, display its distance on the screen.

```blocks
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    brick.showString("Object detected at:", 1)
    brick.showNumber(sensors.ultrasonic4.distance(), 2)
    brick.showString("centimeters", 3)
})
```

## See also

[on event](/reference/sensors/ultrasonic/on-event), [pause until](/reference/sensors/ultrasonic/pause-until)