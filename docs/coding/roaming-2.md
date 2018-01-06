# Roaming Activity 2

```blocks
let drive: number[] = []
brick.buttonLeft.onEvent(ButtonEvent.Click, function () {
    drive.push(1)
    music.playSoundEffectUntilDone(sounds.systemClick)
})
brick.buttonRight.onEvent(ButtonEvent.Click, function () {
    drive.push(3)
    music.playSoundEffectUntilDone(sounds.systemClick)
})
brick.buttonUp.onEvent(ButtonEvent.Click, function () {
    drive.push(4)
    music.playSoundEffectUntilDone(sounds.systemClick)
})
brick.buttonDown.onEvent(ButtonEvent.Click, function () {
    drive.push(5)
    music.playSoundEffectUntilDone(sounds.systemClick)
})
brick.buttonEnter.pauseUntil(ButtonEvent.Click);
loops.pause(1000)
music.playSoundEffectUntilDone(sounds.communicationGo)
for (let d of drive) {
    if (d == 1) {
        motors.largeC.setSpeedFor(50, 360, MoveUnit.Degrees)
        motors.largeC.pauseUntilReady()
    } else if (d == 3) {
        motors.largeB.setSpeedFor(50, 360, MoveUnit.Degrees)
        motors.largeB.pauseUntilReady()
    } else if (d == 4) {
        motors.largeBC.setSpeedFor(50, 360, MoveUnit.Degrees)
        motors.largeBC.pauseUntilReady()
    } else {
        motors.largeBC.setSpeedFor(-50, 360, MoveUnit.Degrees)
        motors.largeBC.pauseUntilReady()
    }
}
music.playSoundEffectUntilDone(sounds.communicationGameOver)
```