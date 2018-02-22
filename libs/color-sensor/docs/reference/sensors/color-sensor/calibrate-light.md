# calibrate Light

Calibrate the thresholds for dark and bright in current lighting conditions.

```sig
sensors.color1.calibrateLight(LightIntensityMode.Ambient, 0)
```

Sometimes when external lighting conditions change, the light sensor measures light intensty differently than when its thresholds were set before. You can calibrate the light sensor to adjust the thresholds slightly for current conditions. This is so that both the ``dark`` and ``bright`` threshold conditions happen with a similar amount of light to what you set the thresholds before.

## Parameters

* **mode**: the type of light threshold to calibrate. This is either ``ambient`` or ``reflected`` light.
* **deviation**: a [number](/types/number) that is the amount of light level change to adjust in a measurement.

## Example

Calibrate the ``dark`` and ``light`` thresholds for the ``color 2`` sensor using reflected light.

```blocks
sensors.color2.calibrateLight(LightIntensityMode.Reflected)
```

## See also

[set threshold](/reference/sensors/color-sensor/set-threshold)