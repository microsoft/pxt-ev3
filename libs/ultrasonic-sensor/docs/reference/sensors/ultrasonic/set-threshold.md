# set Threshold

Set the distance threshold for when objects are near, far, or detected.

```sig
sensors.ultrasonic1.setThreshold(UltrasonicSensorEvent.ObjectDetected, 0)
```

Whether something is near or far away really depends on the situation. A object moving towards you is "near" at further distance than something that isn't moving due to the time necessary to move out of its way. So, in certain situations you may want change which distances mean near or far.

You can change the distances for near and far by setting their _thresholds_. A threshold is a boundary or a limit. If you wanted near to mean anything that's closer that 20 centimeters, then that is your threshold for ``near``.

Similarly, if you are just concerned about knowing that something has moved within a distance from you, then you set that distance as the threshold for ``detected``.

## Parameters

* **condition**: the threshold condition to set a distance for. These are: ``near`` and ``detected``.
* **value**: a [number](/types/number) that the distance in centimeters to set the threshold for.

## Example

Set a threshold for detecting something moving within 30 centimeters. Wait for an object to show up. When it does, flash the status light and make noise as an alarm.

```blocks
sensors.ultrasonic1.setThreshold(UltrasonicSensorEvent.ObjectDetected, 30)
sensors.ultrasonic1.pauseUntil(UltrasonicSensorEvent.ObjectDetected)
brick.clearScreen()
brick.showString("Perimeter Breach!!!", 3)
brick.setStatusLight(StatusLight.RedFlash)
for (let i = 0; i < 10; i++) {
    music.playSoundEffectUntilDone(sounds.mechanicalHorn2)
}
```

## See also

[threshold](/reference/sensors/ultrasonic/threshold)