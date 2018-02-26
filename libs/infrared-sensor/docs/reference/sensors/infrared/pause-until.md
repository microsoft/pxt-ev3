# pause Until

Make your program wait until an some object is detected in proximity of the infrared sensor.

```sig
sensors.infrared1.pauseUntil(InfraredSensorEvent.ObjectDetected);
```

How an object is detected depends on the light _thresholds_ set for the sensor. A threshold is a number for relative distance of the a return of reflected infrared light. The brighter the light, the nearer the object is. The value for what _near_ means is determined by this threshold. A certain minimum amount of light returned is also set to determine that an object is detected. The two thresholds you can set are:

* **near**: a distance to set to detect objects coming close
* **detected**: the brightness of infrared light to needed to detect presence of another infrared transmitter.

## Parameters

* **event**: the object detection action to wait for. The detection types (events) are:
> * ``detected``: some other object is sending out infrared light
> * ``near``: the sensor detected something within the distance of the near threshold

## Example

Wait for another object sending out infrared light. Show a message on the screen when it's dectected.

```blocks
brick.showString("Waiting for another", 1);
brick.showString("robot to appear...", 2);
sensors.infrared1.pauseUntil(InfraredSensorEvent.ObjectDetected);
brick.showString("Hey, I just saw", 1)
brick.showString("Something!", 2);
```

## See also

[on event](/reference/sensors/ultrasonic/on-event)