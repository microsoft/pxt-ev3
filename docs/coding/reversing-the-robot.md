# Reversing the robot

Reverse the robot with button commands.

## Activity 1

Run your robot forward until touch sensor `1` is pressed. Go in reverse and flash a backup light.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    motors.largeBC.run(50)
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    motors.largeBC.run(0)
    pause(1000)
    brick.setStatusLight(StatusLight.OrangeFlash)
    motors.largeBC.run(-50)
    pause(2000)
    motors.largeBC.run(0)
})
```

## Activity 2

Run your robot forward until touch sensor `1` is pressed. Stop when touch sensor `2` is pressed. Wait for a second and go in reverse while flashing a backup light.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    motors.largeBC.run(50)
    sensors.touch2.pauseUntil(ButtonEvent.Pressed)
    motors.largeBC.run(0)
    pause(1000)
    brick.setStatusLight(StatusLight.OrangeFlash)
    motors.largeBC.run(-50)
    pause(2000)
    motors.largeBC.run(0)
})
```

## Activity 3

Use the buttons to wake up the robot and make it move.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    brick.showImage(images.eyesSleeping)
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    brick.showImage(images.eyesNeutral)
    motors.largeBC.run(50)
    sensors.touch2.pauseUntil(ButtonEvent.Pressed)
    brick.showImage(images.eyesTiredMiddle)
    motors.largeBC.run(0)
    pause(1000)
    brick.setStatusLight(StatusLight.OrangeFlash)
    brick.showImage(images.eyesDizzy)
    motors.largeBC.run(-50)
    pause(2000)
    motors.largeBC.run(0)
})
```