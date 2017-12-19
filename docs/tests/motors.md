```typescript
tests.test("lgB set speed 10", () => {
    motors.largeB.setSpeed(10);
    loops.pause(100)
    tests.assertClose("speedB", 10, motors.largeB.speed(), 2)
});
tests.test("lgB set speed 25 (reversed)", () => {
    motors.largeB.setReversed(true)
    motors.largeB.setSpeed(25)
    loops.pause(100)
    tests.assertClose("speedB", -25, motors.largeB.speed(), 2)
});
tests.test("lgBC set speed 5", () => {
    motors.largeBC.setSpeed(5)
    loops.pause(100)
    tests.assertClose("speedB", 5, motors.largeB.speed(), 1);
    tests.assertClose("speedC", 5, motors.largeC.speed(), 1);
});
tests.test("lgBC steer 50% 2x", () => {
    motors.largeBC.setBrake(true)
    motors.largeBC.steer(50, 50, 1, MoveUnit.Rotations)
    loops.pause(1000)
    tests.assertClose("largeB", 360, motors.largeB.angle(), 5)
    motors.largeBC.setBrake(false)
})
tests.test("lgBC steer 50% 500deg", () => {
    motors.largeBC.setBrake(true)
    motors.largeBC.steer(50, 50, 135, MoveUnit.Degrees)
    loops.pause(1000)
    tests.assertClose("largeB", 135, motors.largeB.angle(), 5)
});
tests.test("lgBC steer 50% 2s", () => {
    motors.largeBC.setBrake(true)
    motors.largeBC.steer(50, 50, 500, MoveUnit.MilliSeconds)
    loops.pause(1000)
})
tests.test("lgBC tank 50% 720deg", () => {
    motors.largeBC.setBrake(true)
    motors.largeBC.tank(50, 50, 180, MoveUnit.Degrees)
    loops.pause(1000)
    tests.assertClose("largeB", 180, motors.largeB.angle(), 5)
});
```

```package
tests
```