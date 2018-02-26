# ambient Light

Get the amount of ambient light dectected.

```sig
sensors.color1.ambientLight()
```

The amount of ambient light measured is in the range of `0` (darkest) to `100` (brightest).

## Returns

* a [number](/types/number) that is the amount of ambiernt light measured. No light (darkness) is `0` and the brightest light is `100`.

## Example

Make the status light show ``green`` if the ambient light is greater than `20`.

```blocks
forever(function () {
    if (sensors.color1.ambientLight() > 20) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```

## See also

[reflected light](/reference/sensors/color-sensor/reflected-light)