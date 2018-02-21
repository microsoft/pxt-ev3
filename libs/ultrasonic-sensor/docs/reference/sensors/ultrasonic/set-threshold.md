# set Threshold

Set the distance threshold for when objects are near, far, or detected.

```sig
sensors.ultrasonic1.setThreshold(UltrasonicSensorEvent.ObjectDetected, 0)
```

When something is near or far away really depends on the situation. A object moving towards you is "near" at further distance than something that isn't moving due to the time necessary to move out of its way. So, in certain situations you may want change which distances mean near or far.

You can change the distances for near and far by setting their _thresholds_. A threshold is a boundary or a limit. If you wanted near to mean anything that's closer that 20 centimeters, then that is your threshold for ``near``. Also, if anything further than 35 centimeters is thought of as far, then the threshold for ``far`` is `35`.

Similarly, if you are just concerned knowing when anything is within some distance from you, then you set that distance as the threshold for ``detected``.
