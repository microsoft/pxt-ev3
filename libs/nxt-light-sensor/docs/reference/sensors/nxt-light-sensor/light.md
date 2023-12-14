# light

Get the amount of ambient or reflected light measured by the sensor.

```sig
sensors.nxtLight1.light(NXTLightIntensityMode.Reflected)
```

The light sensor adjusts itself to more accurately measure light depending on the source of the light. You decide if you want to measure _ambient_ light (light all around or direct light) or if you want to know how much light is reflected from a surface. The amount of light measured is in the range of `0` (darkest) to `100` (brightest).

## Parameters

* **mode**: the type of measurement for light. This is either ``ambient`` or ``reflected`` light.

## Returns

* a number that is the amount of light measured. No light (darkness) is `0` and the brightest light is `100`.

## Example

Make the status light show ``green`` if the ambient light is greater than `20`.

```blocks
forever(function () {
    if (sensors.nxtLight1.light(NXTLightIntensityMode.Reflected) > 20) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```
