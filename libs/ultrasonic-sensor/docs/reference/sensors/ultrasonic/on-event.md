# on Event

Run some code when an object is detected by the ultrasonic sensor.

```sig
sensors.ultrasonic1.onEvent(UltrasonicSensorEvent.ObjectDetected, function () {
    
})
```

How an object is detected depends on the distance and movement _thresholds_ set for the sensor. A threshold is a number that is some distance in centimeters or the strength of ultrasonic sound. You can set a distance to detect something that is far, near, or is sending out ultrasound (like the sensor of another robot in the area). The two thresholds you can set are:

* **near**: a distance to set to detect objects coming close
* **detected**: the strength of ultrasound to needed to detect presence of another ultrasonic sensor

Both **near** and **far** have distance thresholds set in centimeters. The **detect** threshold is a value of strength the ultrasonic sound in decibels.

## Parameters

* **event**: the object detection action to wait for. The detection types (events) are:
> * ``object detected``: the detected something that moved
> * ``object near``: the sensor detected something within the distance of the near threshold
* **handler**: the code you want to run when something is dectected by the ultrasonic sensor.

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

[pause until](/reference/sensors/ultrasonic/pause-until)