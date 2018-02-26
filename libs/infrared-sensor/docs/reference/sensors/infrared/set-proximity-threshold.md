# set Proximity Threshold

Set the proximity threshold for when objects are near or detected.

```sig
sensors.infrared1.setPromixityThreshold(InfraredSensorEvent.ObjectNear, 0)
```

Infrared sensors determine proximity of an object by measuring the intensity of the infrared light reflected from it. The proximity range of measurment is from `0` to `100`. You can decide what value in that range you want mean that something is near or that something was detected.

If you want a proximity value of `32` to mean that a detected object is near, then the ``near`` threshold is set to that value. If you want any object within a proximity of `95` to cause a detection event, then the ``detected`` threshold is set to `95`.

## Parameters

* **condition**: the threshold condition to use this proximity. These are: ``near`` and ``detected``.
* **value**: a proximity [number](/types/number) to set the threshold for.

## Example

Set a threshold for detecting something moving within a proximity `30`. Wait for an object to show up. When it does, flash the status light and make noise as an alarm.

```blocks
sensors.infrared1.setPromixityThreshold(InfraredSensorEvent.ObjectDetected, 30)
sensors.infrared1.pauseUntil(InfraredSensorEvent.ObjectDetected)
brick.clearScreen()
brick.showString("Perimeter Breach!!!", 3)
brick.setStatusLight(StatusLight.RedFlash)
for (let i = 0; i < 10; i++) {
    music.playSoundEffectUntilDone(sounds.mechanicalHorn2)
}
```

## See also

[proximity threshold](/reference/sensors/infrared/proximity-threshold)