# on Event

Run some code when an object is detected by the infrared sensor.

```sig
sensors.infrared4.onEvent(InfraredSensorEvent.ObjectNear, function () {});
```

How an object is detected depends on the light _thresholds_ set for the sensor. A threshold is a number for relative distance of the a return of reflected infrared light. The brighter the light, the nearer the object is. The value for what _near_ means is determined by this threshold. A certain minimum amount of light returned is also set to determine that an object is detected. The two thresholds you can set are:

* **near**: a distance to set to detect objects coming close
* **detected**: the brightness of infrared light to needed to detect presence of another infrared transmitter.

## Parameters

* **event**: the object detection action to wait for. The detection types (events) are:
> * ``detected``: some other object is sending out infrared light
> * ``near``: the sensor detected something within the distance of the near threshold
* **body**: the code you want to run when something is detected by infrared sensor.

## Example

When the ultrasonic sensor on port 4 detects a near object, display its distance on the screen.

```blocks
sensors.infrared4.onEvent(InfraredSensorEvent.ObjectNear, function () {
    brick.showString("Object detected at:", 1)
    brick.showNumber(sensors.infrared4.proximity(), 2)
    brick.showString("percent of range", 3)
})
```

## See also

[pause until](/reference/sensors/infrared/pause-until)