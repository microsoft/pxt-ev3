# @extends

## Example #example

Use the a wait and the timer to generate a crazy number.

```blocks
let crazy = 0
for (let i = 0; i < 100; i++) {
    control.waitMicros(100)
    crazy = control.millis()
    crazy += control.deviceSerialNumber()
    if (crazy != 0) {
        crazy = crazy / 1000000
    }
}
```