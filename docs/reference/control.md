# Control

Program controls and events.

```cards
control.millis();
control.runInParallel(() => {
    
});
control.reset();
control.waitMicros(4);
control.deviceSerialNumber();
```

## Timer

```cards
control.timer1.reset()
control.timer1.pauseUntil(5)
control.timer1.millis()
control.timer1.seconds()
```

## Advanced #advanced

```cards
control.raiseEvent(0, 0);
control.onEvent(0, 0, () => {
    
});
control.assert(false, 0);
control.panic(0);
```