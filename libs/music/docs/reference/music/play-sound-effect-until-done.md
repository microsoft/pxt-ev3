# play Sound Effect Until Done

Play a sound from one of the built-in sound effect until it completes.

```sig
music.playSoundEffectUntilDone(null)
```

There are several sound effects you can play. Use the sounds list in the block to pick the sound you want to play. The sound plays and this part of your program waits until the sound finishes. Other parts of your program, like code in **forever** loops and **runInParallel** blocks will continue to run though.

Many of the built-in sound effects make sounds match to the actions that your @boardname@ is doing. For example, you can add the ``mechanical motor start`` sound your program to indicate that your motors are running.

## Parameters

* **sound**: a built-in sound effect from the list of available sounds.

## Example

Make a game where the buttons on the brick are used to guess a number from `1` to `4` that your program randomly chooses. On the correct guess, flash a ``green`` status light and play a cheering sound. The ``enter`` button resets the game to play again.

```blocks
let pick = 0
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    pick = 0
    music.stopAllSounds()
    brick.setStatusLight(StatusLight.Off)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    pick = 1
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    pick = 2
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    pick = 3
})
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    pick = 4
})
forever(function () {
    if (pick > 0) {
        if (Math.randomRange(0, 3) + 1 == pick) {
            brick.setStatusLight(StatusLight.GreenFlash)
            music.playSoundEffectUntilDone(sounds.expressionsCheering)
        }
        pick = 0
    }
    pause(300)
})
```

## See also

[play sound effect](/reference/music/play-sound-effect), [stop all sounds](/reference/music/stop-all-sounds)