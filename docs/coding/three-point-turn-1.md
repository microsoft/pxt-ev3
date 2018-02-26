# Three Point Turn Activity 1

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    motors.largeBC.tank(75, 30)
    pause(1500)
    motors.largeBC.tank(-30, -75)
    pause(1000)
    motors.largeBC.tank(50, 50)
    pause(3000)
})
```