# set Light

Set the light on the brick to a solid or flashing color.

```sig
brick.setStatusLight(StatusLight.Red);
```
## Parameters

* **pattern**: the color or color pattern for the brick light to show. The brick light can have these color patterns:
>* `off`: brick light is off
>* `green`: solid green
>* `red`: solid red
>* `orange`: solid orange
>* `green flash`: flashing green
>* `red flash`: flashing red
>* `orange flash`: flashing orange
>* `green pulse`: pulsing green
>* `red pulse`: pulsing red
>* `orange pulse`: pulsing orange

## Example

Repeatedly show a different color pattern for the brick light.

```blocks
forever(function () {
    brick.setStatusLight(StatusLight.Orange)
    pause(1000)
    brick.setStatusLight(StatusLight.GreenFlash)
    pause(2000)
    brick.setStatusLight(StatusLight.RedPulse)
    pause(2000)
    brick.setStatusLight(StatusLight.Off)
    pause(500)
})
```
