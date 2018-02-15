// add tests package
tests.test("lgB set speed 10", () => {
    motors.largeB.setSpeed(10);
    pause(500)
    tests.assertClose("speedB", 10, motors.largeB.speed(), 2)
});
tests.test("lgB set speed 25 (reversed)", () => {
    motors.largeB.setInverted(true)
    motors.largeB.setSpeed(25)
    pause(500)
    tests.assertClose("speedB", -25, motors.largeB.speed(), 2)
});
tests.test("lgBC set speed 5", () => {
    motors.largeBC.setSpeed(5)
    pause(500)
    tests.assertClose("speedB", 5, motors.largeB.speed(), 1);
    tests.assertClose("speedC", 5, motors.largeC.speed(), 1);
});
tests.test("lgBC steer 50% 2x", () => {
    motors.largeBC.setBrake(true)
    motors.largeBC.steer(50, 50, 1, MoveUnit.Rotations)
    pause(2000)
    tests.assertClose("largeB", 360, motors.largeB.angle(), 5)
    motors.largeBC.setBrake(false)
})
tests.test("lgBC steer 360deg", () => {
    motors.largeBC.setBrake(true)
    motors.largeBC.steer(50, 50, 360, MoveUnit.Degrees)
    pause(2000)
    tests.assertClose("largeB", 360, motors.largeB.angle(), 5)
});
tests.test("lgBC steer 50% 1s", () => {
    motors.largeBC.setBrake(true)
    motors.largeBC.steer(10, 50, 1000, MoveUnit.MilliSeconds)
    pause(2000)
})
tests.test("lgBC tank 50% 180deg", () => {
    motors.largeBC.setBrake(true)
    motors.largeBC.tank(50, 50, 180, MoveUnit.Degrees)
    pause(1000)
    tests.assertClose("largeB", 180, motors.largeB.angle(), 5)
});
