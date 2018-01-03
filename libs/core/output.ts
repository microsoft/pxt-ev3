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
    BC = Output.B | Output.C,
    //% block="A+B"
    AB = Output.A | Output.B,
    //% block="C+D"
    CD = Output.C | Output.D,
    //% block="A+D"
    AD = Output.A | Output.D,
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
    //% block="milliseconds"
    MilliSeconds
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

        resetAllMotors()

        const buf = output.createBuffer(1)
        buf[0] = DAL.opProgramStart
        writePWM(buf)
    }

    /**
     * Sends a command to the motors device
     * @param buf the command buffer
     */
    //%
    export function writePWM(buf: Buffer): void {
        init()
        pwmMM.write(buf)
    }

    /**
     * Sends and receives a message from the motors device
     * @param buf message buffer
     */
    //%
    export function readPWM(buf: Buffer): void {
        init()
        pwmMM.read(buf);
    }

    /**
     * Allocates a message buffer
     * @param out ports
     * @param cmd command id
     * @param addSize required additional bytes
     */
    //%
    export function mkCmd(out: Output, cmd: number, addSize: number) {
        const b = output.createBuffer(2 + addSize)
        b.setNumber(NumberFormat.UInt8LE, 0, cmd)
        b.setNumber(NumberFormat.UInt8LE, 1, out)
        return b
    }

    function outputToName(out: Output): string {
        let r = "";
        for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
            if (out & (1 << i)) {
                if (r.length > 0) r += "+";
                r += "ABCD"[i];
            }
        }
        return r;
    }

    /**
     * Stops all motors
     */
    //% blockId=motorStopAll block="stop all motors"
    //% weight=97
    //% group="Motion"
    export function stopAllMotors() {
        const b = mkCmd(Output.ALL, DAL.opOutputStop, 0)
        writePWM(b)
    }

    /**
     * Resets all motors
     */
    //% group="Motion"
    export function resetAllMotors() {
        reset(Output.ALL)
    }

    //% fixedInstances
    export class MotorBase extends control.Component {
        protected _port: Output;
        protected _portName: string;
        protected _brake: boolean;
        private _initialized: boolean;
        private _init: () => void;
        private _setSpeed: (speed: number) => void;
        private _move: (steps: boolean, stepsOrTime: number, speed: number) => void;

        constructor(port: Output, init: () => void, setSpeed: (speed: number) => void, move: (steps: boolean, stepsOrTime: number, speed: number) => void) {
            super();
            this._port = port;
            this._portName = outputToName(this._port);
            this._brake = false;
            this._initialized = false;
            this._init = init;
            this._setSpeed = setSpeed;
            this._move = move;
        }

        /**
         * Lazy initialization code
         */
        protected init() {
            if (!this._initialized) {
                this._initialized = true;
                this._init();
            }
        }

        /**
         * Sets the automatic brake on or off when the motor is off
         * @param brake a value indicating if the motor should break when off
         */
        //% blockId=outputMotorSetBrakeMode block="set %motor|brake %brake"
        //% brake.fieldEditor=toggleonoff
        //% weight=60 blockGap=8
        //% group="Motion"
        setBrake(brake: boolean) {
            this.init();
            this._brake = brake;
        }

        /** 
         * Reverses the motor polarity
        */
        //% blockId=motorSetReversed block="set %motor|reversed %reversed"
        //% reversed.fieldEditor=toggleonoff
        //% weight=59
        //% group="Motion"
        setReversed(reversed: boolean) {
            this.init();
            const b = mkCmd(this._port, DAL.opOutputPolarity, 1)
            b.setNumber(NumberFormat.Int8LE, 2, reversed ? 0 : 1);
            writePWM(b)
        }

        /**
         * Stops the motor(s).
         */
        //%
        stop() {
            this.init();
            stop(this._port, this._brake);
        }

        /**
         * Resets the motor(s).
         */
        //%
        reset() {
            this.init();
            reset(this._port);
        }

        /**
         * Sets the speed of the motor.
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         */
        //% blockId=motorSetSpeed block="set speed of %motor|to %speed|%"
        //% on.fieldEditor=toggleonoff
        //% weight=99 blockGap=8
        //% speed.min=-100 speed.max=100
        //% group="Motion"
        setSpeed(speed: number) {
            this.init();
            speed = Math.clamp(-100, 100, speed >> 0);
            if (!speed) // always stop
                this.stop();
            else
                this._setSpeed(speed);
        }

        /**
         * Moves the motor by a number of rotations, degress or seconds
         * @param value the move quantity, eg: 2
         * @param unit the meaning of the value
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         */
        //% blockId=motorMove block="move %motor|for %value|%unit|at %speed|%"
        //% weight=98 blockGap=8
        //% speed.min=-100 speed.max=100    
        //% group="Motion"
        move(value: number, unit: MoveUnit, speed: number) {
            this.init();
            speed = Math.clamp(-100, 100, speed >> 0);
            if (!speed) {
                this.stop();
                return;
            }
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

            this._move(useSteps, stepsOrTime, speed);
        }

        /**
         * Returns a value indicating if the motor is still running a previous command.
         */
        //%
        isReady(): boolean {
            this.init();
            const buf = mkCmd(this._port, DAL.opOutputTest, 2);
            readPWM(buf)
            const flags = buf.getNumber(NumberFormat.UInt8LE, 2);
            // TODO: FIX with ~ support
            for(let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
                const flag = 1 << i;
                if ((this._port & flag) && (flags & flag))
                    return false;
            }
            return true;
        }

        /**
         * Pauses the execution until the previous command finished.
         * @param timeOut optional maximum pausing time in milliseconds
         */
        //% blockId=motorPauseUntilRead block="%motor|pause until ready"
        //% group="Motion"
        pauseUntilReady(timeOut?: number) {
            pauseUntil(() => this.isReady(), timeOut);
        }
    }

    //% fixedInstances
    export class Motor extends MotorBase {
        private _large: boolean;

        constructor(port: Output, large: boolean) {
            super(port, () => this.__init(), (speed) => this.__setSpeed(speed), (steps, stepsOrTime, speed) => this.__move(steps, stepsOrTime, speed));
            this._large = large;
            this.markUsed();
        }

        markUsed() {
            motors.__motorUsed(this._port, this._large);
        }

        private __init() {
            // specify motor size on this port            
            const b = mkCmd(outOffset(this._port), DAL.opOutputSetType, 1)
            b.setNumber(NumberFormat.Int8LE, 2, this._large ? 0x07 : 0x08)
            writePWM(b)
        }

        private __setSpeed(speed: number) {
            const b = mkCmd(this._port, DAL.opOutputSpeed, 1)
            b.setNumber(NumberFormat.Int8LE, 2, speed)
            writePWM(b)
            if (speed) {
                writePWM(mkCmd(this._port, DAL.opOutputStart, 0))
            }
        }

        private __move(steps: boolean, stepsOrTime: number, speed: number) {
            step(this._port, {
                useSteps: steps,
                step1: 0,
                step2: stepsOrTime,
                step3: 0,
                speed: speed,
                useBrake: this._brake
            })
        }

        /**
         * Gets motor actual speed.
         * @param motor the port which connects to the motor
         */
        //% blockId=motorSpeed block="%motor|speed"
        //% weight=72 blockGap=8
        //% group="Sensors"
        speed(): number {
            this.init();
            return getMotorData(this._port).actualSpeed;
        }

        /**
         * Gets motor ration angle.
         * @param motor the port which connects to the motor
         */
        //% blockId=motorTachoCount block="%motor|angle"
        //% weight=70
        //% group="Sensors"
        angle(): number {
            this.init();
            return getMotorData(this._port).count;
        }

        /**
         * Clears the motor count
         */
        //% group="Motion"
        clearCount() {
            this.init();
            const b = mkCmd(this._port, DAL.opOutputClearCount, 0)
            writePWM(b)
            for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
                if (this._port & (1 << i)) {
                    motorMM.setNumber(NumberFormat.Int32LE, i * MotorDataOff.Size + MotorDataOff.TachoSensor, 0)
                }
            }
        }

        /**
         * Returns the status of the motor
         */
        //%
        toString(): string {
            return `${this._large ? "" : "M"}${this._portName} ${this.speed()}% ${this.angle()}>`;
        }
    }

    //% whenUsed fixedInstance block="large A"
    export const largeA = new Motor(Output.A, true);

    //% whenUsed fixedInstance block="large B"
    export const largeB = new Motor(Output.B, true);

    //% whenUsed fixedInstance block="large C"
    export const largeC = new Motor(Output.C, true);

    //% whenUsed fixedInstance block="large D"
    export const largeD = new Motor(Output.D, true);

    //% whenUsed fixedInstance block="medium A"
    export const mediumA = new Motor(Output.A, false);

    //% whenUsed fixedInstance block="medium B"
    export const mediumB = new Motor(Output.B, false);

    //% whenUsed fixedInstance block="medium C"
    export const mediumC = new Motor(Output.C, false);

    //% whenUsed fixedInstance block="medium D"
    export const mediumD = new Motor(Output.D, false);

    //% fixedInstances
    export class SynchedMotorPair extends MotorBase {
        private wheelRadius: number;
        private baseLength: number;

        constructor(ports: Output) {
            super(ports, () => this.__init(), (speed) => this.__setSpeed(speed), (steps, stepsOrTime, speed) => this.__move(steps, stepsOrTime, speed));
            this.wheelRadius = 2;
            this.baseLength = 10;
            this.markUsed();
        }

        markUsed() {
            motors.__motorUsed(this._port, true);
        }

        private __init() {
            for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
                if (this._port & (1 << i)) {
                    const b = mkCmd(outOffset(1 << i), DAL.opOutputSetType, 1)
                    b.setNumber(NumberFormat.Int8LE, 2, 0x07) // large motor
                    writePWM(b)
                }
            }
        }

        private __setSpeed(speed: number) {
            syncMotors(this._port, {
                speed: speed,
                turnRatio: 0,
                useBrake: !!this._brake
            })
        }

        private __move(steps: boolean, stepsOrTime: number, speed: number) {
            syncMotors(this._port, {
                useSteps: steps,
                speed: speed,
                turnRatio: 100, // same speed
                stepsOrTime: stepsOrTime,
                useBrake: this._brake
            });
        }

        /**
         * Turns the motor and the follower motor by a number of rotations
         * @param turnRatio the ratio of power sent to the follower motor, from ``-200`` to ``200``, eg: 100
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         * @param value the move quantity, eg: 2
         * @param unit the meaning of the value
         */
        //% blockId=motorPairTurn block="steer %chassis|%turnRatio|%|at speed %speed|%|for %value|%unit"
        //% weight=9 blockGap=8
        //% turnRatio.min=-200 turnRatio=200
        //% inlineInputMode=inline
        //% group="Chassis"
        steer(turnRatio: number, speed: number, value: number, unit: MoveUnit) {
            this.init();
            speed = Math.clamp(-100, 100, speed >> 0);
            if (!speed) {
                stop(this._port, this._brake);
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
                    stepsOrTime = value >> 0;
                    useSteps = false;
                    break;
            }

            syncMotors(this._port, {
                useSteps: useSteps,
                speed: speed,
                turnRatio: turnRatio,
                stepsOrTime: stepsOrTime,
                useBrake: this._brake
            });
        }

        /**
         * The Move Tank block can make a robot drive forward, backward, turn, or stop. 
         * Use the Move Tank block for robot vehicles that have two Large Motors, 
         * with one motor driving the left side of the vehicle and the other the right side. 
         * You can make the two motors go at different speeds or in different directions 
         * to make your robot turn.
         * @param value the amount of movement, eg: 2
         * @param unit 
         * @param speedLeft the speed on the left motor, eg: 50
         * @param speedRight the speed on the right motor, eg: 50
         */
        //% blockId=motorPairTank block="tank %chassis|left %speedLeft|%|right %speedRight|%|for %value|%unit"
        //% weight=9 blockGap=8
        //% speedLeft.min=-100 speedLeft=100
        //% speedRight.min=-100 speedRight=100
        //% inlineInputMode=inline
        //% group="Chassis"
        tank(speedLeft: number, speedRight: number, value: number, unit: MoveUnit) {
            this.init();

            speedLeft = Math.clamp(-100, 100, speedLeft >> 0);
            speedRight = Math.clamp(-100, 100, speedRight >> 0);
            const turnRatio = speedLeft == 0 ? 0 : speedRight / speedLeft * 100;
            this.steer(turnRatio, speedLeft, value, unit);
        }

        /**
         * Makes a differential drive robot move with a given speed (%) and rotation rate (deg/s)
         * using a unicycle model.
         * @param speed speed of the center point between motors
         * @param rotationSpeed rotation of the robot around the center point
         * @param value the amount of movement, eg: 2
         * @param unit 
         */
        //% blockId=motorDrive block="drive %chassis|at %speed|cm/s|turning %rotationSpeed|deg/s|for %value|%unit"
        //% inlineInputMode=inline
        //% group="Chassis"
        //% weight=8 blockGap=8
        drive(speed: number, rotationSpeed: number, value: number, unit: MoveUnit) {
            this.init();

            // speed is expressed in %
            const R = this.wheelRadius; // cm
            const L = this.baseLength; // cm
            const PI = 3.14;
            const maxw = 170 / 60 * 2 * PI; // rad / s
            const maxv = maxw * R; // cm / s
            // speed is cm / s
            const v = speed; // cm / s
            const w = rotationSpeed / 360 * 2 * PI; // rad / s

            const vr = (2 * v + w * L) / (2 * R); // rad / s
            const vl = (2 * v - w * L) / (2 * R); // rad / s

            const sr = vr / maxw * 100; // % 
            const sl = vl / maxw * 100; // %

            this.tank(sr, sl, value, unit)
        }        

        /**
         * Sets the wheels radius and base length of a directional drive robot
         * @param wheelRadius 
         * @param baseLength 
         */
        //%
        setDimensions(wheelRadius: number, baseLength: number): void {
            this.wheelRadius = wheelRadius;
            this.baseLength = baseLength;
        }

        /**
         * Returns the name(s) of the motor
         */
        //%
        toString(): string {
            this.init();

            let r = outputToName(this._port);
            for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
                if (this._port & (1 << i)) {
                    r += ` ${getMotorData(1 << i).actualSpeed}%`
                }
            }
            return r;
        }
    }

    //% whenUsed fixedInstance block="large B+C"
    export const largeBC = new SynchedMotorPair(Output.BC);

    //% whenUsed fixedInstance block="large A+D"
    export const largeAD = new SynchedMotorPair(Output.AD);

    //% whenUsed fixedInstance block="large A+B"
    export const largeAB = new SynchedMotorPair(Output.AB);

    //% whenUsed fixedInstance block="large C+D"
    export const largeCD = new SynchedMotorPair(Output.CD);

    function reset(out: Output) {
        writePWM(mkCmd(out, DAL.opOutputReset, 0))
        writePWM(mkCmd(out, DAL.opOutputClearCount, 0))
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
    function getMotorData(out: Output): MotorData {
        init()
        const buf = motorMM.slice(outOffset(out), MotorDataOff.Size)
        return {
            actualSpeed: buf.getNumber(NumberFormat.Int8LE, MotorDataOff.Speed),
            tachoCount: buf.getNumber(NumberFormat.Int32LE, MotorDataOff.TachoCounts),
            count: buf.getNumber(NumberFormat.Int32LE, MotorDataOff.TachoSensor),
        }
    }

    export function getAllMotorData(): MotorData[] {
        init();
        return [Output.A, Output.B, Output.C, Output.D].map(out => getMotorData(out));
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

    function stop(out: Output, brake: boolean) {
        const b = mkCmd(out, DAL.opOutputStop, 1)
        b.setNumber(NumberFormat.UInt8LE, 2, brake ? 1 : 0)
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