# Three Point Turn Activity 1

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Click, function () {
    motors.largeBC.tankFor(75, 30, 1.5, MoveUnit.Seconds)
    motors.largeBC.pauseUntilReady()
    motors.largeBC.tankFor(-30, -75, 1, MoveUnit.Seconds)
    motors.largeBC.pauseUntilReady()
    motors.largeBC.tankFor(50, 50, 3, MoveUnit.Seconds)
    motors.largeBC.pauseUntilReady()
})
```