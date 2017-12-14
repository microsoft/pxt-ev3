enum Output {
    //% block="A"
    A = 0x01,
    //% block="B"
    B = 0x02,
    //% block="C"
    C = 0x04,
    //% block="D"
    D = 0x08,
    //% block="B+C"
    BC = 0x06,
    //% block="All"
    ALL = 0x0f
}

enum OutputType {
    None = 0,
    Tacho = 7,
    MiniTacho = 8,
}

enum MoveUnit {
    //% block="rotations"
    Rotations,
    //% block="degrees"
    Degrees,
    //% block="seconds"
    Seconds
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
    //% weight=10 blockGap=8
    export function stopAllMotors() {
        const b = mkCmd(Output.ALL, DAL.opOutputStop, 0)
        writePWM(b)
    }

    //% fixedInstances
    export class Motor extends control.Component {
        private _port: Output;
        private _large: boolean;

        private _initialized: boolean;
        private _brake: boolean;
        private _follower: Motor; // 

        constructor(port: Output, large: boolean) {
            super();
            this._port = port;
            this._large = large;
            this._brake = false;
        }

        private __init() {
            if (!this._initialized) {
                // specify motor size on this port            
                const b = mkCmd(this._port, DAL.opOutputSetType, 1)
                b.setNumber(NumberFormat.Int8LE, 2, this._large ? 0x07 : 0x08)
                writePWM(b)
            }
        }

        /**
         * Sets the speed of the motor.
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         */
        //% blockId=motorPower block="set speed of `icons.motorLarge` %motor|to %speed|%"
        //% on.fieldEditor=toggleonoff
        //% weight=99 blockGap=8
        //% speed.min=-100 speed.max=100
        setSpeed(speed: number) {
            this.__init();
            speed = Math.clamp(-100, 100, speed >> 0);
            if (!speed) { // always stop
                this.stop();
            } else {
                if (this._follower) this.setSpeedSync(speed);
                else this.setSpeedSingle(speed);
            }
        }

        private setSpeedSingle(speed: number) {
            const b = mkCmd(this._port, DAL.opOutputSpeed, 1)
            b.setNumber(NumberFormat.Int8LE, 2, speed)
            writePWM(b)
        }

        private setSpeedSync(speed: number) {
            const out = this._port | this._follower._port;
            syncMotors(out, {
                speed: speed,
                turnRatio: 0,
                useBrake: !!this._brake
            })
        }

        /**
         * Moves the motor by a number of rotations, degress or seconds
         * @param value the move quantity, eg: 2
         * @param unit the meaning of the value
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         */
        //% blockId=motorMove block="move `icons.motorLarge` %motor|for %value|%unit|at %speed|%"
        //% weight=98
        //% speed.min=-100 speed.max=100    
        move(value: number, unit: MoveUnit, speed: number) {
            this.output(value, unit, speed, 0);
        }
            
        private output(value: number, unit: MoveUnit, speed: number, turnRatio: number) {
            this.__init();
            speed = Math.clamp(-100, 100, speed >> 0);
            if (!speed) {
                this.stop();
                return;
            }
            turnRatio = Math.clamp(-200, 200, turnRatio >> 0);
            let useSteps: boolean;
            let stepsOrTime: number;
            switch (unit) {
                case MoveUnit.Rotations:
                    stepsOrTime = (value * 360) >> 0;
                    useSteps = true;
                    break;
                case MoveUnit.Degrees:
                    stepsOrTime = value >> 0;
                    useSteps = true;
                    break;
                default:
                    stepsOrTime = value;
                    useSteps = false;
                    break;
            }

            if (this._follower) {
                syncMotors(this._port | this._follower._port, {
                    useSteps: useSteps,
                    stepsOrTime: stepsOrTime,
                    speed: speed,
                    turnRatio: turnRatio,
                    useBrake: this._brake
                })
            } else {
                step(this._port, {
                    useSteps: useSteps,
                    step1: 0,
                    step2: stepsOrTime,
                    step3: 0,
                    speed: speed,
                    useBrake: this._brake
                })
            }
        }

        /**
         * Stops the motor
         */
        private stop() {
            this.__init();
            if (this._follower) stop(this._port | this._follower._port);
            else stop(this._port);
        }

        /**
         * Sets the automatic brake on or off when the motor is off
         * @param brake a value indicating if the motor should break when off
         */
        //% blockId=outputMotorSetBrakeMode block="set `icons.motorLarge` %motor|brake %brake"
        //% brake.fieldEditor=toggleonoff
        //% weight=60 blockGap=8
        setBrake(brake: boolean) {
            this.__init();
            this._brake = brake;
        }

        /** 
         * Reverses the motor polarity
        */
        //% blockId=motorSetReversed block="set `icons.motorLarge` %motor|reversed %reversed"
        //% reversed.fieldEditor=toggleonoff
        //% weight=59
        setReversed(reversed: boolean) {
            this.__init();
            const b = mkCmd(this._port, DAL.opOutputPolarity, 1)
            b.setNumber(NumberFormat.Int8LE, 2, reversed ? -1 : 1);
            writePWM(b)
        }

        /**
         * Gets motor actual speed.
         * @param motor the port which connects to the motor
         */
        //% blockId=motorSpeed block="`icons.motorLarge` %motor|speed"
        //% weight=72 blockGap=8
        speed(): number {
            this.__init();
            return getMotorData(this._port).actualSpeed;
        }

        /**
         * Gets motor step count.
         * @param motor the port which connects to the motor
         */
        //% blockId=motorCount block="`icons.motorLarge` %motor|count"
        //% weight=71 blockGap=8
        count(): number {
            this.__init();
            return getMotorData(this._port).count;
        }

        /**
         * Gets motor tacho count.
         * @param motor the port which connects to the motor
         */
        //% blockId=motorTachoCount block="`icons.motorLarge` %motor|tacho count"
        //% weight=70
        tachoCount(): number {
            this.__init();
            return getMotorData(this._port).tachoCount;
        }

        /**
         * Clears the motor count
         */
        clearCount() {
            this.__init();
            const b = mkCmd(this._port, DAL.opOutputClearCount, 0)
            writePWM(b)
            for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
                if (this._port & (1 << i)) {
                    motorMM.setNumber(NumberFormat.Int32LE, i * MotorDataOff.Size + MotorDataOff.TachoSensor, 0)
                }
            }
        }

        /**
         * Resets the motor and clears any synchronization
         */
        //% blockId=motorReset block="reset `icons.motorLarge` %motor"
        //% weight=1
        reset() {
            this.__init();
            reset(this._port);
            delete this._follower;
        }

        /**
         * Synchronizes a follower motor to this motor
         * @param motor the leader motor, eg: motors.largeB
         * @param follower the motor that follows this motor commands, eg: motors.largeC
         */
        //% blockId=motorSync block="sync `icons.motorLarge` %motor|with `icons.motorLarge` %follower"
        //% weight=10 blockGap=8
        sync(follower: Motor) {
            this.__init();
            if (this == follower) return; // can't sync with self
            this._follower = follower;
        }

        /**
         * Turns the motor and the follower motor by a number of rotations
         * @param value the move quantity, eg: 2
         * @param unit the meaning of the value
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         * @param turnRatio the ratio of power sent to the follower motor, from -200 to 200
         */
        //% blockId=motorTurn block="turn `icons.motorLarge` %motor|by %value|%unit|at %speed|% turn %turnRadio"
        //% weight=9 blockGap=8
        //% turnRatio.min=-200 turnRatio=200
        turn(value: number, unit: MoveUnit, speed: number, turnRatio: number) {
            this.output(value, unit, speed, turnRatio);
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

    interface SyncOptions {
        useSteps?: boolean;
        speed: number;
        turnRatio: number;
        stepsOrTime?: number;
        useBrake?: boolean;
    }

    function syncMotors(out: Output, opts: SyncOptions) {
        const cmd = opts.useSteps ? DAL.opOutputStepSync : DAL.opOutputTimeSync;
        const b = mkCmd(out, cmd, 11);
        const speed = Math.clamp(-100, 100, opts.speed);
        const turnRatio = Math.clamp(-200, 200, opts.turnRatio);

        b.setNumber(NumberFormat.Int8LE, 2, speed)
        // note that b[3] is padding
        b.setNumber(NumberFormat.Int16LE, 4 + 4 * 0, turnRatio)
        // b[6], b[7] is padding
        b.setNumber(NumberFormat.Int32LE, 4 + 4 * 1, opts.stepsOrTime || 0)
        b.setNumber(NumberFormat.Int8LE, 4 + 4 * 2, opts.useBrake ? 1 : 0)
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

    function start(out: Output) {
        const b = mkCmd(out, DAL.opOutputStart, 0)
        writePWM(b);
    }

    function stop(out: Output) {
        const b = mkCmd(out, DAL.opOutputStop, 1)
        b.setNumber(NumberFormat.UInt8LE, 2, this.brake ? 1 : 0)
        writePWM(b);
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