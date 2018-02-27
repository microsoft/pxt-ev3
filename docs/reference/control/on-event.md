# @extends

# Example #example

Register two events coming from source `22`. Make the brick status light up  when
the events of `0` and `1` are _raised_.

```blocks
const statusLighter = 22;

control.runInParallel(() => {
    for (let i = 0; i < 2; i++) {
        pause(1000);
        control.raiseEvent(statusLighter, i);
    }
})

control.onEvent(statusLighter, 0, () => {
    brick.setStatusLight(StatusLight.OrangePulse)
})

control.onEvent(statusLighter, 1, () => {
    brick.setStatusLight(StatusLight.GreenPulse)
})
```