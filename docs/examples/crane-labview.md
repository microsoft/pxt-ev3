# Crane LabView

```blocks
function INI() {
    motors.largeB.setBrake(true)
    motors.largeC.setBrake(true)
    motors.mediumA.setBrake(true)
    motors.largeB.run(-50)
    pauseUntil(() => sensors.color3.light(LightIntensityMode.Reflected) > 25);
    motors.largeB.stop();
    motors.mediumA.run(30, 1, MoveUnit.Seconds);
    motors.mediumA.run(-50, 90, MoveUnit.Degrees);
    motors.largeC.run(50)
    sensors.touch1.pauseUntil(ButtonEvent.Pressed);
    motors.largeC.run(-50, 0.86, MoveUnit.Rotations);
}

INI()

let down = false;
forever(function () {
    brick.showImage(images.informationQuestionMark)
    brick.setStatusLight(StatusLight.OrangePulse);
    pauseUntil(() => (down = brick.buttonDown.wasPressed()) || brick.buttonUp.wasPressed())
    brick.setStatusLight(StatusLight.Off)
    music.playSoundEffect(sounds.mechanicalAirRelease)
    brick.showImage(images.informationAccept)
    if (down) {
        brick.showImage(images.informationForward)
        motors.largeC.run(65, 0.85, MoveUnit.Rotations);
    } else {
        brick.showImage(images.informationBackward)
        motors.largeC.run(-65, 0.85, MoveUnit.Rotations);
    }
    motors.largeB.run(20, 275, MoveUnit.Degrees)
    motors.mediumA.run(30, 1, MoveUnit.Seconds)
    motors.largeB.run(-55)
    pauseUntil(() => sensors.color3.light(LightIntensityMode.Reflected) > 25);
    motors.largeB.stop();
    if (down) {
        motors.largeC.run(-65, 0.86, MoveUnit.Rotations);
    } else {
        motors.largeC.run(65, 0.85, MoveUnit.Rotations);
    }
    motors.largeB.run(20, 275, MoveUnit.Degrees);
    motors.mediumA.run(-30, 90, MoveUnit.Degrees);
    motors.largeB.run(-55)
    pauseUntil(() => sensors.color3.light(LightIntensityMode.Reflected) > 25);
    motors.largeB.stop()
})
```