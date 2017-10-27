enum Output {
    //% block="A"
    A = 0x01,
    //% block="B"
    B = 0x02,
    //% block="C"
    C = 0x04,
    //% block="D"
    D = 0x08,
    //% block="All"
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

        resetMotors()

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
        const b = createBuffer(2 + addSize)
        b.setNumber(NumberFormat.UInt8LE, 0, cmd)
        b.setNumber(NumberFormat.UInt8LE, 1, out)
        return b
    }

    function resetMotors() {
        reset(Output.ALL)
    }

    //% fixedInstances
    export class Motor extends control.Component {
        private port: Output;
        private large: boolean;
        private brake: boolean;

        constructor(port: Output, large: boolean) {
            super();
            this.port = port;
            this.large = large;
            this.brake = false;
        }

        /**
         * Power on or off the motor.
         * @param motor the motor to turn on
         * @param power the motor power level from ``-100`` to ``100``, eg: 50
         */
        //% blockId=outputMotorOn block="%motor|%onOrOff"
        //% weight=99 group="Motors" blockGap=8
        //% onOrOff.fieldEditor=toggleonoff
        on(onOrOff: boolean = true) {
            if (onOrOff) {
                const b = mkCmd(this.port, DAL.opOutputStart, 0)
                writePWM(b);    
            } else {
                const b = mkCmd(this.port, DAL.opOutputStop, 1)
                b.setNumber(NumberFormat.UInt8LE, 2, this.brake ? 1 : 0)
                writePWM(b)                    
            }
        }

        /**
         * Sets the motor power level from ``-100`` to ``100``.
         * @param motor the output connection that the motor is connected to
         * @param power the desired speed to use. eg: 50
         */
        //% blockId=motorSetPower block="%motor|set power to %speed"
        //% weight=60 group="Motors" blockGap=8
        //% speed.min=-100 speed.max=100
        setPower(power: number) {
            const b = mkCmd(this.port, DAL.opOutputPower, 1)
            b.setNumber(NumberFormat.Int8LE, 2, Math.clamp(-100, 100, power))
            writePWM(b)
        }

        /**
         * Sets the automatic brake on or off when the motor is off
         * @param brake a value indicating if the motor should break when off
         */
        //% blockId=outputMotorSetBrakeMode block="%motor|set brake %brake"
        //% brake.fieldEditor=toggleonoff
        //% weight=60 group="Motors"
        setBrake(brake: boolean) {
            this.brake = brake;
        }

        /**
         * Gets motor actual speed.
         * @param motor the port which connects to the motor
         */
        //% blockId=motorSpeed block="%motor|speed"
        //% weight=50 group="Motors" blockGap=8
        speed() {
            return getMotorData(this.port).actualSpeed;
        }
    }

    //% whenUsed fixedInstance block="large motor A"
    export const largeMotorA = new Motor(Output.A, true);

    //% whenUsed fixedInstance block="large motor B"
    export const largeMotorB = new Motor(Output.B, true);

    //% whenUsed fixedInstance block="large motor C"
    export const largeMotorC = new Motor(Output.C, true);

    //% whenUsed fixedInstance block="large motor D"
    export const largeMotorD = new Motor(Output.D, true);

    //% whenUsed fixedInstance block="medium motor A"
    export const mediumMotorA = new Motor(Output.A, false);

    //% whenUsed fixedInstance block="medium motor B"
    export const mediumMotorB = new Motor(Output.B, false);

    //% whenUsed fixedInstance block="medium motor C"
    export const mediumMotorC = new Motor(Output.C, false);

    //% whenUsed fixedInstance block="medium motor D"
    export const mediumMotorD = new Motor(Output.D, false);

    function reset(out: Output) {
        let b = mkCmd(out, DAL.opOutputReset, 0)
        writePWM(b)
    }

    function clearCount(out: Output) {
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

    interface MotorData {
        actualSpeed: number; // -100..+100
        tachoCount: number;
        count: number;
    }

    // only a single output at a time
    function getMotorData(out: Output): MotorData {
        let buf = motorMM.slice(outOffset(out), MotorDataOff.Size)
        return {
            actualSpeed: buf.getNumber(NumberFormat.Int8LE, MotorDataOff.Speed),
            tachoCount: buf.getNumber(NumberFormat.Int32LE, MotorDataOff.TachoCounts),
            count: buf.getNumber(NumberFormat.Int32LE, MotorDataOff.TachoSensor),
        }
    }

    function setPolarity(out: Output, polarity: number) {
        let b = mkCmd(out, DAL.opOutputPolarity, 1)
        b.setNumber(NumberFormat.Int8LE, 2, Math.clamp(-1, 1, polarity))
        writePWM(b)
    }

    interface StepOptions {
        power?: number;
        speed?: number; // either speed or power has to be present
        step1: number;
        step2: number;
        step3: number;
        useSteps?: boolean; // otherwise use milliseconds
        useBrake?: boolean;
    }

    function step(out: Output, opts: StepOptions) {
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