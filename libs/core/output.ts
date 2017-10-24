enum Output {
    A = 0x01,
    B = 0x02,
    C = 0x04,
    D = 0x08,
    ALL = 0x0f
}

enum OutputType {
    None = 0,
    Tacho = 7,
    MiniTacho = 8,
}

namespace output {
    let pwmMM: MMap
    let motorMM: MMap
    let currentSpeed: number[] = []

    const enum MotorDataOff {
        TachoCounts = 0, // int32
        Speed = 4, // int8
        Padding = 5, // int8[3]
        TachoSensor = 8, // int32
        Size = 12
    }

    function init() {
        if (pwmMM) return
        pwmMM = control.mmap("/dev/lms_pwm", 0, 0)
        if (!pwmMM) control.fail("no PWM file")
        motorMM = control.mmap("/dev/lms_motor", MotorDataOff.Size * DAL.NUM_OUTPUTS, 0)

        stop(Output.ALL)

        currentSpeed[Output.A] = -1;
        currentSpeed[Output.B] = -1;
        currentSpeed[Output.C] = -1;
        currentSpeed[Output.D] = -1;
        currentSpeed[Output.ALL] = -1;

        let buf = output.createBuffer(1)
        buf[0] = DAL.opProgramStart
        writePWM(buf)
    }

    function writePWM(buf: Buffer): void {
        init()
        pwmMM.write(buf)
    }

    function readPWM(buf: Buffer): void {
        init()
        pwmMM.read(buf);
    }

    function mkCmd(out: Output, cmd: number, addSize: number) {
        let b = createBuffer(2 + addSize)
        b.setNumber(NumberFormat.UInt8LE, 0, cmd)
        b.setNumber(NumberFormat.UInt8LE, 1, out)
        return b
    }

    /**
     * Turn a motor on for a specified number of milliseconds.
     * @param out the output connection that the motor is connected to
     * @param ms the number of milliseconds to turn the motor on, eg: 500
     * @param useBrake whether or not to use the brake, defaults to false
     */
    //% blockId=output_turn block="turn motor %out| on for %ms=timePicker|milliseconds"
    //% weight=100 group="Motors"
    export function turn(out: Output, ms: number, useBrake = false) {
        // TODO: use current power / speed configuration
        output.step(out, {
            speed: 100,
            step1: 0,
            step2: ms,
            step3: 0,
            useSteps: false,
            useBrake: useBrake
        })
    }


    /**
     * Switch the motor on or off.
     * @param out the output connection that the motor is connected to
     * @param on 1 to turn the motor on, 0 to turn it off
     */
    //% blockId=outputMotorPowerOnOff block="power motor %out|%on"
    //% weight=90 group="Motors"
    //% on.fieldEditor="toggleonoff"
    export function powerMotor(out: Output, on: boolean, useBrake = false) {
        if (on) {
            output.start(out);
        } else {
            output.stop(out, useBrake);
        }
    }

    /**
     * Turn motor off.
     * @param out the output connection that the motor is connected to
     */
    //% blockId=output_stop block="turn motor %out|off"
    //% weight=90 group="Motors"
    //% deprecated=1
    export function stop(out: Output, useBrake = false) {
        let b = mkCmd(out, DAL.opOutputStop, 1)
        b.setNumber(NumberFormat.UInt8LE, 2, useBrake ? 1 : 0)
        writePWM(b)
    }

    /**
     * Turn motor on.
     * @param out the output connection that the motor is connected to
     */
    //% blockId=output_start block="turn motor %out|on"
    //% weight=95 group="Motors"
    //% deprecated=1
    export function start(out: Output) {
        if (currentSpeed[out] == -1) setSpeed(out, 50)
        let b = mkCmd(out, DAL.opOutputStart, 0)
        writePWM(b)
    }

    export function reset(out: Output) {
        let b = mkCmd(out, DAL.opOutputReset, 0)
        writePWM(b)
    }

    export function clearCount(out: Output) {
        let b = mkCmd(out, DAL.opOutputClearCount, 0)
        writePWM(b)
        for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
            if (out & (1 << i)) {
                motorMM.setNumber(NumberFormat.Int32LE, i * MotorDataOff.Size + MotorDataOff.TachoSensor, 0)
            }
        }
    }

    function outOffset(out: Output) {
        for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
            if (out & (1 << i))
                return i * MotorDataOff.Size
        }
        return 0
    }

    export interface MotorData {
        actualSpeed: number; // -100..+100
        tachoCount: number;
        count: number;
    }

    // only a single output at a time
    export function getMotorData(out: Output): MotorData {
        let buf = motorMM.slice(outOffset(out), MotorDataOff.Size)
        return {
            actualSpeed: buf.getNumber(NumberFormat.Int8LE, MotorDataOff.Speed),
            tachoCount: buf.getNumber(NumberFormat.Int32LE, MotorDataOff.TachoCounts),
            count: buf.getNumber(NumberFormat.Int32LE, MotorDataOff.TachoSensor),
        }
    }

    /**
     * Get motor speed.
     * @param out the output connection that the motor is connected to
     */
    //% blockId=output_getCurrentSpeed block="motor %out|speed"
    //% weight=70 group="Motors"
    export function getCurrentSpeed(out: Output) {
        return getMotorData(out).actualSpeed;
    }

    /**
     * Set motor speed.
     * @param out the output connection that the motor is connected to
     * @param speed the desired speed to use. eg: 100
     */
    //% blockId=output_setSpeed block="set motor %out| speed to %speed"
    //% weight=81 group="Motors"
    //% speed.min=-100 speed.max=100
    export function setSpeed(out: Output, speed: number) {
        currentSpeed[out] = speed;
        let b = mkCmd(out, DAL.opOutputSpeed, 1)
        b.setNumber(NumberFormat.Int8LE, 2, Math.clamp(-100, 100, speed))
        writePWM(b)
    }

    /**
     * Set motor power.
     * @param out the output connection that the motor is connected to
     * @param power the desired power to use. eg: 100
     */
    //% blockId=output_setPower block="set motor %out| power to %power"
    //% weight=80 group="Motors"
    //% power.min=-100 power.max=100
    export function setPower(out: Output, power: number) {
        let b = mkCmd(out, DAL.opOutputPower, 1)
        b.setNumber(NumberFormat.Int8LE, 2, Math.clamp(-100, 100, power))
        writePWM(b)
    }

    export function setPolarity(out: Output, polarity: number) {
        let b = mkCmd(out, DAL.opOutputPolarity, 1)
        b.setNumber(NumberFormat.Int8LE, 2, Math.clamp(-1, 1, polarity))
        writePWM(b)
    }

    export interface StepOptions {
        power?: number;
        speed?: number; // either speed or power has to be present
        step1: number;
        step2: number;
        step3: number;
        useSteps?: boolean; // otherwise use milliseconds
        useBrake?: boolean;
    }

    export function step(out: Output, opts: StepOptions) {
        let op = opts.useSteps ? DAL.opOutputStepSpeed : DAL.opOutputTimeSpeed
        let speed = opts.speed
        if (speed == null) {
            speed = opts.power
            op = opts.useSteps ? DAL.opOutputStepPower : DAL.opOutputTimePower
            if (speed == null)
                return
        }
        speed = Math.clamp(-100, 100, speed)

        let b = mkCmd(out, op, 15)
        b.setNumber(NumberFormat.Int8LE, 2, speed)
        // note that b[3] is padding
        b.setNumber(NumberFormat.Int32LE, 4 + 4 * 0, opts.step1)
        b.setNumber(NumberFormat.Int32LE, 4 + 4 * 1, opts.step2)
        b.setNumber(NumberFormat.Int32LE, 4 + 4 * 2, opts.step3)
        b.setNumber(NumberFormat.Int8LE, 4 + 4 * 3, opts.useBrake ? 1 : 0)
        writePWM(b)
    }

    const types = [0, 0, 0, 0]
    export function setType(out: Output, type: OutputType) {
        let b = mkCmd(out, DAL.opOutputSetType, 3)
        for (let i = 0; i < 4; ++i) {
            if (out & (1 << i)) {
                types[i] = type
            }
            b.setNumber(NumberFormat.UInt8LE, i + 1, types[i])
        }
        writePWM(b)
    }
}


interface Buffer {
    [index: number]: number;
    // rest defined in buffer.cpp
}