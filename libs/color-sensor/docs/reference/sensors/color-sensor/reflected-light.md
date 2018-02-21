# reflected Light

```sig
sensors.color1.reflectedLight()
```

```blocks
forever(function () {
    if (sensors.color1.reflectedLight() > 20) {
        brick.setStatusLight(StatusLight.Green)
    } else {
        brick.setStatusLight(StatusLight.Orange)
    }
})
```