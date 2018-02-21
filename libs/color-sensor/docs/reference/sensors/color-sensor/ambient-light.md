# ambient Light

```sig
sensors.color1.ambientLight()
```

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

[reflected light](/reference/sensors/color/reflected-light)