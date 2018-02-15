# Robot Arm

```typescript
function INI() {
    motors.largeB.setBrake(true)
    motors.largeC.setBrake(true)
    motors.mediumA.setBrake(true)
    motors.largeB.setSpeed(-50)
    pauseUntil(() => sensors.color3.light(LightIntensityMode.Reflected) > 25);
    motors.largeB.stop();
    motors.mediumA.setSpeed(30, 1, MoveUnit.Seconds);
    motors.mediumA.setSpeed(-50, 90, MoveUnit.Degrees);
    motors.largeC.setSpeed(50)
    sensors.touch1.pauseUntil(ButtonEvent.Pressed);
    motors.largeC.setSpeed(-50, 0.86, MoveUnit.Rotations);
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
        motors.largeC.setSpeed(65, 0.85, MoveUnit.Rotations);
    } else {
        brick.showImage(images.informationBackward)
        motors.largeC.setSpeed(-65, 0.85, MoveUnit.Rotations);
    }
    motors.largeB.setSpeed(20, 275, MoveUnit.Degrees)
    motors.mediumA.setSpeed(30, 1, MoveUnit.Seconds)
    motors.largeB.setSpeed(-55)
    pauseUntil(() => sensors.color3.light(LightIntensityMode.Reflected) > 25);
    motors.largeB.stop();
    if (down) {
        motors.largeC.setSpeed(-65, 0.86, MoveUnit.Rotations);
    } else {
        motors.largeC.setSpeed(65, 0.85, MoveUnit.Rotations);
    }
    motors.largeB.setSpeed(20, 275, MoveUnit.Degrees);
    motors.mediumA.setSpeed(-30, 90, MoveUnit.Degrees);
    motors.largeB.setSpeed(-55)
    pauseUntil(() => sensors.color3.light(LightIntensityMode.Reflected) > 25);
    motors.largeB.stop()
})
```