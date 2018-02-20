# Gyroboy

Work in progress

```blocks
let motorSpeed1 = 0
let motorSpeed2 = 0
let motorSpeed3 = 0
let motorSpeed = 0
let fallen = false
let motorSpeed0 = 0
let oldControlDrive = 0
let controlDrive = 0
let power = 0
let motorAngle = 0
let gyroAngle = 0
let controlSteering = 0
let state = 0
let motorPosition = 0
let temp = 0
let gyroRate = 0
let timestep = 0
sensors.color1.onColorDetected(ColorSensorColor.Red, function () {
    music.playTone(2000, 100)
    controlDrive = 0
    controlSteering = 0
})
// reads the motor angle and computes the motor speed,
// position
function computeMotors() {
    temp = motorAngle
    // read angle on both motors
    motorAngle = motors.largeD.angle() + motors.largeA.angle()
    // and estimate speed as angle difference
    motorSpeed0 = motorAngle - temp
    // average last 4 speed readings
    motorSpeed = (motorSpeed0 + motorSpeed1 + motorSpeed2 + motorSpeed3) / 4 / timestep
    // shift all previous recorded speeds by one
    motorSpeed3 = motorSpeed2
    motorSpeed2 = motorSpeed1
    motorSpeed1 = motorSpeed0
    // compute position from speed
    motorPosition = motorPosition + timestep * motorSpeed
}
// read the gyro rate and computes the angle
function computeGyro() {
    gyroRate = sensors.gyro2.rate()
    gyroAngle = gyroAngle + timestep * gyroRate
}
function reset() {
    state = 0
    // sleeping
    moods.sleeping.show();
    // reset counters
    motors.largeA.reset()
    motors.largeD.reset()
    // motors are unregulated
    motors.largeA.setRegulated(false)
    motors.largeD.setRegulated(false)
    // clear the gyro sensor to remove drift
    sensors.gyro2.reset()
    // fall detection timer
    control.timer2.reset()
    // timestep computation timer
    control.timer3.reset()
    motorAngle = 0
    motorPosition = 0
    motorSpeed = 0
    motorSpeed0 = 0
    motorSpeed1 = 0
    motorSpeed2 = 0
    motorSpeed3 = 0
    gyroRate = 0
    gyroAngle = 0
    fallen = false
    power = 0
    controlSteering = 0
    controlDrive = 0
    // awake
    moods.awake.show();
    gyroAngle = -0.25
    state = 1;
}
// compute set point for motor position and required
// motor power
function computePower() {
    // apply control and compute desired motor position
    motorPosition -= timestep * controlDrive;
    // estimate power based on sensor readings and control
    // values
    power = 0.8 * gyroRate + 15 * gyroAngle + (0.08 * motorSpeed + 0.12 * motorPosition) - 0.01 * controlDrive
    // ensure that power stays within -100, 100
    if (power > 100) {
        power = 100
    } else if (power < -100) {
        power = -100
    }
}
// test if the robot has fallen off
function checkFallen() {
    if (Math.abs(power) < 100) {
        control.timer2.reset()
    }
    if (control.timer2.seconds() > 2) {
        fallen = true
    }
}
// stop all motors and wait for touch button to be
// pressed
function stop() {
    motors.stopAll()
    state = 0
    moods.knockedOut.show();
    sensors.touch3.pauseUntil(ButtonEvent.Pressed)
    moods.neutral.show();
}
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    moods.dizzy.show()
    controlSteering = 0
    oldControlDrive = controlDrive
    controlDrive = -10
    motors.mediumC.run(30, 30, MoveUnit.Degrees);
    motors.mediumC.run(-30, 60, MoveUnit.Degrees);
    motors.mediumC.run(30, 30, MoveUnit.Degrees);
    if (Math.randomRange(-1, 1) >= 1) {
        controlSteering = 70
    } else {
        controlSteering = -70
    }
    pause(4000)
    music.playTone(2000, 100)
    controlSteering = 0
    controlDrive = oldControlDrive
    moods.neutral.show()
})
// compute the elapsed time since the last iteration
function computeTimestep() {
    timestep = control.timer3.seconds()
    control.timer3.reset()
}
sensors.color1.onColorDetected(ColorSensorColor.Green, function () {
    moods.winking.show()
    controlDrive = 150
    controlSteering = 0
})
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () {
    moods.middleRight.show()
    controlSteering = 70
})
// apply power to motors
function controlMotors() {
    motors.largeA.run(power + controlSteering * 0.1)
    motors.largeD.run(power - controlSteering * 0.1)
}
sensors.color1.onColorDetected(ColorSensorColor.Yellow, function () {
    moods.middleLeft.show()
    controlSteering = -70
})
sensors.color1.onColorDetected(ColorSensorColor.White, function () {
    moods.sad.show();
    controlDrive = -75
})
timestep = 0.014
// main loop
forever(function () {
    reset()
    while (!fallen) {
        control.timer3.pauseUntil(5)
        computeTimestep()
        computeGyro()
        computeMotors()
        computePower()
        controlMotors()
        checkFallen()
    }
    stop()
})
```