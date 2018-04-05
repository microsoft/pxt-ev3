# pause Until

Make your program wait until an some object is detected in proximity of the sensor.

```sig
sensors.ultrasonic1.pauseUntil(UltrasonicSensorEvent.ObjectDetected);
```

How an object is detected depends on the distance and movement _thresholds_ set for the sensor. A threshold is a number that is some distance in centimeters or the strength of ultrasonic sound. You can set a distance to detect something that is far, near, or is sending out ultrasound (like the sensor of another robot in the area). The three thresholds you can set are:

* **near**: a distance to set to detect objects coming close
* **far**: a distance to set to detect objects farther away but not as close as the **near** threshold
* **detected**: the strength of ultrasound to needed to detect presence of another ultrasonic sensor

Both **near** and **far** have distance thresholds set in centimeters. The **detect** threshold is a value of strength the ultrasonic sound in decibels.

## Parameters

* **event**: the object detection action to wait for. The detection types (events) are:
> * ``detected``: some other object is sending out an ultrasonic sound
> * ``near``: the sensor detected something within the distance of the near threshold

## Example

Wait for another object sending out ultrasonic sound. Show a message on the screen when it's dectected.

```blocks
brick.showString("Waiting for another", 1);
brick.showString("robot to appear...", 2);
sensors.ultrasonic1.pauseUntil(UltrasonicSensorEvent.ObjectDetected);
brick.showString("Hey, I just heard", 1)
brick.showString("Something!", 2);
```

## See also

[on event](/reference/sensors/ultrasonic/on-event)