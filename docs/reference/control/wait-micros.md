# @extends

## Example #example

Use a wait and the timer to generate a number.

```blocks
let something = 0
for (let i = 0; i < 100; i++) {
    control.waitMicros(100)
    something = control.millis()
    something += control.deviceSerialNumber()
    if (something != 0) {
        something = something / 1000000
    }
}
```