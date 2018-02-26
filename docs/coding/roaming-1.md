# Roaming Activity 1

```blocks
let drive: number[] = []
brick.buttonLeft.onEvent(ButtonEvent.Bumped, function () {
    drive.push(1)
})
brick.buttonRight.onEvent(ButtonEvent.Bumped, function () {
    drive.push(3)
})
brick.buttonUp.onEvent(ButtonEvent.Bumped, function () {
    drive.push(4)
})
brick.buttonDown.onEvent(ButtonEvent.Bumped, function () {
    drive.push(5)
})
pauseUntil(() => drive.length >= 5)
pause(1000)
music.playSoundEffectUntilDone(sounds.communicationGo)
for (let d of drive) {
    if (d == 1) {
        motors.largeC.run(50, 360, MoveUnit.Degrees)
    } else if (d == 3) {
        motors.largeB.run(50, 360, MoveUnit.Degrees)
    } else if (d == 4) {
        motors.largeBC.run(50, 360, MoveUnit.Degrees)
    } else {
        motors.largeBC.run(-50, 360, MoveUnit.Degrees)
    }
}
music.playSoundEffectUntilDone(sounds.communicationGameOver)
```