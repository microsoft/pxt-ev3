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

namespace motors {
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
        if (!motorMM) control.fail("no motor file")
            
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
        const b = output.createBuffer(2 + addSize)
        b.setNumber(NumberFormat.UInt8LE, 0, cmd)
        b.setNumber(NumberFormat.UInt8LE, 1, out)
        return b
    }

    function resetMotors() {
        reset(Output.ALL)
    }

    /**
     * Stops all motors
     */
    //% blockId=motorStopAll block="stop all `icons.motorLarge`"
    //% weight=10 group="Motors" blockGap=8
    export function stopAllMotors() {
        const b = mkCmd(Output.ALL, DAL.opOutputStop, 0)
        writePWM(b)
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
         * Sets the motor speed level from ``-100`` to ``100``.
         * @param motor the output connection that the motor is connected to
         * @param speed the power from ``100`` full forward to ``-100`` full backward, eg: 50
         */
        //% blockId=motorSetSpeed block="set speed `icons.motorLarge` %motor|to %speed|%"
        //% weight=99 group="Motors" blockGap=8
        //% speed.min=-100 speed.max=100
        setSpeed(speed: number) {
            speed = Math.clamp(-100, 100, speed >> 0);

            // per LEGO: call it power, use speed
            const b = mkCmd(this.port, DAL.opOutputSpeed, 1)
            b.setNumber(NumberFormat.Int8LE, 2, speed)
            writePWM(b)
            if (speed) {
                const b = mkCmd(this.port, DAL.opOutputStart, 0)
                writePWM(b);
            } else {
                this.stop();
            }
        }

        /**
         * Moves the motor by a number of degrees
         * @param degrees the angle to turn the motor
         * @param angle the degrees to rotate, eg: 360
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         */
        //% blockId=motorMove block="move `icons.motorLarge` %motor|by %angle|degrees at %speed|%"
        //% weight=98 group="Motors" blockGap=8
        //% speed.min=-100 speed.max=100
        move(angle: number, power: number) {
            angle = angle >> 0;
            power = Math.clamp(-100, 100, power >> 0);

            step(this.port, {
                speed: power,
                step1: 0,
                step2: angle,
                step3: 0,
                useSteps: true,
                useBrake: this.brake
            })
        }

        /**
         * Stops the motor
         */
        //% blockId=motorStop block="stop `icons.motorLarge` %motor"
        //% weight=97 group="Motors"
        stop() {
            const b = mkCmd(this.port, DAL.opOutputStop, 1)
            b.setNumber(NumberFormat.UInt8LE, 2, this.brake ? 1 : 0)
            writePWM(b);
        }

        /**
         * Sets the automatic brake on or off when the motor is off
         * @param brake a value indicating if the motor should break when off
         */
        //% blockId=outputMotorSetBrakeMode block="set `icons.motorLarge` %motor|brake %brake"
        //% brake.fieldEditor=toggleonoff
        //% weight=60 group="Motors" blockGap=8
        setBrake(brake: boolean) {
            this.brake = brake;
        }

        /** 
         * Reverses the motor polarity
        */
        //% blockId=motorSetReversed block="set `icons.motorLarge` %motor|reversed %reversed"
        //% reversed.fieldEditor=toggleonoff
        //% weight=59 group="Motors"
        setReversed(reversed: boolean) {
            const b = mkCmd(this.port, DAL.opOutputPolarity, 1)
            b.setNumber(NumberFormat.Int8LE, 2, reversed ? -1 : 1);
            writePWM(b)
        }

        /**
         * Gets motor actual speed.
         * @param motor the port which connects to the motor
         */
        //% blockId=motorSpeed block="`icons.motorLarge` %motor|speed"
        //% weight=72 group="Motors" blockGap=8
        speed(): number {
            return getMotorData(this.port).actualSpeed;
        }

        /**
         * Gets motor step count.
         * @param motor the port which connects to the motor
         */
        //% blockId=motorCount block="`icons.motorLarge` %motor|count"
        //% weight=71 group="Motors" blockGap=8
        count(): number {
            return getMotorData(this.port).count;
        }

        /**
         * Gets motor tacho count.
         * @param motor the port which connects to the motor
         */
        //% blockId=motorTachoCount block="`icons.motorLarge` %motor|tacho count"
        //% weight=70 group="Motors"
        tachoCount(): number {
            return getMotorData(this.port).tachoCount;
        }

        /**
         * Clears the motor count
         */
        clearCount() {
            const b = mkCmd(this.port, DAL.opOutputClearCount, 0)
            writePWM(b)
            for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
                if (this.port & (1 << i)) {
                    motorMM.setNumber(NumberFormat.Int32LE, i * MotorDataOff.Size + MotorDataOff.TachoSensor, 0)
                }
            }
        }

        /**
         * Resets the motor.
         */
        reset() {
            reset(this.port);
        }
    }

    //% whenUsed fixedInstance block="large A"
    export const largeMotorA = new Motor(Output.A, true);

    //% whenUsed fixedInstance block="large B"
    export const largeMotorB = new Motor(Output.B, true);

    //% whenUsed fixedInstance block="large C"
    export const largeMotorC = new Motor(Output.C, true);

    //% whenUsed fixedInstance block="large D"
    export const largeMotorD = new Motor(Output.D, true);

    //% whenUsed fixedInstance block="medium A"
    export const mediumMotorA = new Motor(Output.A, false);

    //% whenUsed fixedInstance block="medium B"
    export const mediumMotorB = new Motor(Output.B, false);

    //% whenUsed fixedInstance block="medium C"
    export const mediumMotorC = new Motor(Output.C, false);

    //% whenUsed fixedInstance block="medium D"
    export const mediumMotorD = new Motor(Output.D, false);

    function reset(out: Output) {
        let b = mkCmd(out, DAL.opOutputReset, 0)
        writePWM(b)
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
        init()
        let buf = motorMM.slice(outOffset(out), MotorDataOff.Size)
        return {
            actualSpeed: buf.getNumber(NumberFormat.Int8LE, MotorDataOff.Speed),
            tachoCount: buf.getNumber(NumberFormat.Int32LE, MotorDataOff.TachoCounts),
            count: buf.getNumber(NumberFormat.Int32LE, MotorDataOff.TachoSensor),
        }
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