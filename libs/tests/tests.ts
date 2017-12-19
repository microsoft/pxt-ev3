/**
 * Unit tests framework
 */
//% weight=100 color=#0fbc11 icon=""
namespace tests {
    class Test {
        name: string;
        handler: () => void;
        errors: string[];

        constructor(name: string, handler: () => void) {
            this.name = name;
            this.handler = handler;
            this.errors = [];
        }

        reset() {
            motors.stopAllMotors();
            motors.resetAllMotors();
        }

        run() {
            // clear state
            this.reset();

            console.log(`> ${this.name}`)
            this.handler()

            if (this.errors.length)
                console.log('')

            // ensure clean state after test
            this.reset();
        }
    }

    let _tests: Test[] = undefined;
    let _currentTest: Test = undefined;

    function run() {
        if (!_tests) return;

        const start = control.millis();
        console.sendToScreen();
        console.log(`${_tests.length} tests found`)
        console.log(` `)
        for (let i = 0; i < _tests.length; ++i) {
            const t = _currentTest = _tests[i];
            t.run();
            _currentTest = undefined;
        }
        console.log(` `)
        console.log(`${_tests.length} tests, ${_tests.map(t => t.errors.length).reduce((p, c) => p + c, 0)} errs in ${Math.ceil((control.millis() - start) / 1000)}s`)
    }

    /**
     * Registers a test to run
     */
    //% blockId=testtest block="test %name"
    export function test(name: string, handler: () => void): void {
        if (!name || !handler) return;
        if (!_tests) {
            _tests = [];
            control.runInBackground(function () {
                // should run after on start
                loops.pause(100)
                run()
            })
        }
        _tests.push(new Test(name, handler));
    }

    /** 
     * Checks a boolean condition
     */
    //% blockId=testAssert block="assert %message|%condition"
    export function assert(message: string, condition: boolean) {
        if (!condition) {
            console.log(`!!! ${message || ''}`)
            if (_currentTest)
                _currentTest.errors.push(message);
        }
    }

    /**
     * Checks that 2 values are close to each other
     * @param expected what the value should be
     * @param actual what the value was
     * @param tolerance the acceptable error margin
     */
    export function assertClose(name: string, expected: number, actual: number, tolerance: number) {
        assert(`${name} ${expected} != ${actual} +-${tolerance}`, Math.abs(expected - actual) <= tolerance);
    }
}
