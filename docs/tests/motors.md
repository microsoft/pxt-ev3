```typescript
let errors: string[] = [];
let tachoB = 0;
let tachoC = 0;

function assert(name: string, condition: boolean) {
    if (!condition) {
        errors.push(name)
    }
}

function assertClose(name: string, expected: number, actual: number, tolerance = 5) {
    const diff = Math.abs(expected - actual);
    assert(name + ` ${expected}vs${actual}`, diff < tolerance);
}

function state(name: string, motor: motors.SingleMotor, line: number) {
    brick.print(`${name}: ${motor.speed()}%,${motor.angle()}deg`, 0, 12 * line)
}

function test(name: string, f: () => void, check?: () => void) {
    motors.stopAllMotors();
    motors.largeB.clearCount()
    motors.largeC.clearCount()
    motors.largeB.setBrake(false)
    motors.largeC.setBrake(false)
    loops.pause(500);
    tachoB = motors.largeB.angle()
    tachoC = motors.largeC.angle()
    brick.clearScreen()
    brick.print(name, 0, 0)
    state("B", motors.largeB, 1)
    state("C", motors.largeC, 2)
    f();
    loops.pause(3000);
    motors.largeB.setReversed(false);
    motors.largeC.setReversed(false);
    motors.mediumA.setReversed(false);
    state("B", motors.largeB, 3)
    state("C", motors.largeC, 4)
    if (check)
        check()
    motors.stopAllMotors();
    loops.pause(1000);
}

brick.buttonEnter.onEvent(ButtonEvent.Click, function () {
    test("lgB set speed 10", () => {
        motors.largeB.setSpeed(10)
    }, () => assertClose("speedB", 10, motors.largeB.speed()));
    test("lgB set speed 25 (reversed)", () => {
        motors.largeB.setReversed(true)
        motors.largeB.setSpeed(25)
    }, () => assertClose("speedB", -25, motors.largeB.speed()));
    test("lgBC set speed 5", () => {
        motors.largeBC.setSpeed(5)
    }, () => {
        assertClose("speedB", 5, motors.largeB.speed());
        assertClose("speedC", 5, motors.largeC.speed());
    });
    test("lgBC steer 50% 2x", () => {
        motors.largeBC.setBrake(true)
        motors.largeBC.steer(50, 50, 2, MoveUnit.Rotations)
    }, () => assertClose("largeB", 720, motors.largeB.angle()));
    test("lgBC steer 50% 500deg", () => {
        motors.largeBC.setBrake(true)
        motors.largeBC.steer(50, 50, 500, MoveUnit.Degrees)
    }, () => assertClose("largeB", 500, motors.largeB.angle()));
    test("lgBC steer 50% 2s", () => {
        motors.largeBC.setBrake(true)
        motors.largeBC.steer(50, 50, 2000, MoveUnit.MilliSeconds)
    })
    test("lgBC tank 50% 720deg", () => {
        motors.largeBC.setBrake(true)
        motors.largeBC.tank(50, 50, 720, MoveUnit.Degrees)
    }, () => assertClose("largeB", 720, motors.largeB.angle()));

    brick.clearScreen()
    brick.print(`${errors.length} errors`, 0, 0)
    let l = 1;
    for (const error of errors)
        brick.print(`error: ${error}`, 0, l++ * 12)
})
```