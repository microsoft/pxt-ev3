let errors: string[] = [];
let tachoB = 0;
let tachoC = 0;

function assert(name: string, condition: boolean) {
    if (!condition) {
        errors.push(name)
    }
}

function assertClose(name: string, expected: number, actual: number, tolerance = 10) {
    assert(name + ` ${expected}/${actual}`, Math.abs(expected - actual) < tolerance);
}

function test(name: string, f: () => void, check?: () => void) {
    motors.stopAllMotors();
    loops.pause(500);
    tachoB = motors.largeB.tachoCount()
    tachoC = motors.largeB.tachoCount()
    brick.clearScreen()
    brick.print(name, 0, 0)
    f();
    loops.pause(3000);
    motors.stopAllMotors();
    motors.largeB.setReversed(false);
    motors.largeC.setReversed(false);
    motors.mediumA.setReversed(false);
    loops.pause(1000);
    if (check)
        check()
}

brick.buttonEnter.onEvent(ButtonEvent.Click, function () {
    test("lgB set speed 100", () => {
        motors.largeB.setSpeed(100)
    });
    test("lgB set speed (reversed)", () => {
        motors.largeB.setReversed(true)
        motors.largeB.setSpeed(100)
    })
    test("lgBC set speed 100", () => {
        motors.largeBC.setSpeed(100)
    })
    test("lgBC steer 50% 2x", () => {
        motors.largeBC.steer(50, 50, 2, MoveUnit.Rotations)
    }, () => {
        assertClose("largeB", 720, motors.largeB.tachoCount() - tachoB)
    });
    test("lgBC steer 50% 500deg", () => {
        motors.largeBC.steer(50, 50, 500, MoveUnit.Degrees)
    }, () => {
        assertClose("largeB", 500, motors.largeB.tachoCount() - tachoB)
    });
    test("lgBC steer 50% 2s", () => {
        motors.largeBC.steer(50, 50, 2, MoveUnit.Seconds)
    })
    test("lgBC tank 50% 2s", () => {
        motors.largeBC.tank(50, 50, 720, MoveUnit.Degrees)
    })

    brick.clearScreen()
    brick.print(`${errors.length} errors`, 0, 0)
    let l = 1;
    for(const error of errors)
        brick.print(`error: ${error}`, 0, l++ * 12)
})
