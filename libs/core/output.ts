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
    AD = Output.B | Output.C,
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
    //% blockId=motorStopAll block="stop all motors"
    //% weight=97
    //% group="Motion"
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
         * Gets the port where this motor is connected
         */
        //%
        //% group="Motion"
        port(): Output {
            return this._port;
        }

        /**
         * Sets the speed of the motor.
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         */
        //% blockId=motorSetSpeed block="set speed of `icons.motorLarge` %motor|to %speed|%"
        //% on.fieldEditor=toggleonoff
        //% weight=99 blockGap=8
        //% speed.min=-100 speed.max=100
        //% group="Motion"
        setSpeed(speed: number) {
            this.__init();
            speed = Math.clamp(-100, 100, speed >> 0);
            if (!speed) { // always stop
                this.stop();
            } else {
                const b = mkCmd(this._port, DAL.opOutputSpeed, 1)
                b.setNumber(NumberFormat.Int8LE, 2, speed)
                writePWM(b)
            }
        }

        /**
         * Moves the motor by a number of rotations, degress or seconds
         * @param value the move quantity, eg: 2
         * @param unit the meaning of the value
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         */
        //% blockId=motorMove block="move `icons.motorLarge` %motor|for %value|%unit|at %speed|%"
        //% weight=98 blockGap=8
        //% speed.min=-100 speed.max=100    
        //% group="Motion"
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

            step(this._port, {
                useSteps: useSteps,
                step1: 0,
                step2: stepsOrTime,
                step3: 0,
                speed: speed,
                useBrake: this._brake
            })
        }

        /**
         * Stops the motor
         */
        private stop() {
            this.__init();
            stop(this._port);
        }

        /**
         * Sets the automatic brake on or off when the motor is off
         * @param brake a value indicating if the motor should break when off
         */
        //% blockId=outputMotorSetBrakeMode block="set `icons.motorLarge` %motor|brake %brake"
        //% brake.fieldEditor=toggleonoff
        //% weight=60 blockGap=8
        //% group="Motion"
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
        //% group="Motion"
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
        //% group="Sensors"
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
        //% group="Sensors"
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
        //% group="Sensors"
        tachoCount(): number {
            this.__init();
            return getMotorData(this._port).tachoCount;
        }

        /**
         * Clears the motor count
         */
        //% group="Motion"
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
         * Resets the motor.
         */
        //% blockId=motorReset block="reset `icons.motorLarge` %motor"
        //% weight=20
        //% group="Motion"
        reset() {
            this.__init();
            reset(this._port);
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
    export class SynchedMotorPair extends control.Component {
        private _ports: Output;
        private _brake: boolean;

        constructor(ports: Output) {
            super();
            this._ports = ports;
            this._brake = false;
        }

        /**
         * Sets the speed of the motor.
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         */
        //% blockId=motorPairSetSpeed block="set speed of `icons.motorLarge` %motor|to %speed|%"
        //% on.fieldEditor=toggleonoff
        //% weight=99 blockGap=8
        //% speed.min=-100 speed.max=100
        //% group="Chassis"
        setSpeed(speed: number) {
            speed = Math.clamp(speed >> 0, -100, 100);
            if (!speed) {
                stop(this._ports);
                return;
            }
            syncMotors(this._ports, {
                speed: speed,
                turnRatio: 0,
                useBrake: !!this._brake
            })
        }

        /**
         * Sets the automatic brake on or off when the motor is off
         * @param brake a value indicating if the motor should break when off
         */
        //% blockId=motorPairSetBrakeMode block="set `icons.motorLarge` %chassis|brake %brake"
        //% brake.fieldEditor=toggleonoff
        //% weight=60 blockGap=8
        //% group="Chassis"
        setBrake(brake: boolean) {
            this._brake = brake;
        }

        /**
         * Turns the motor and the follower motor by a number of rotations
         * @param value the move quantity, eg: 2
         * @param unit the meaning of the value
         * @param speed the speed from ``100`` full forward to ``-100`` full backward, eg: 50
         * @param steering the ratio of power sent to the follower motor, from ``-100`` to ``100``
         */
        //% blockId=motorPairTurn block="move steering %chassis|at %speed|%|steer %turnRadio|%|by %value|%unit"
        //% weight=9 blockGap=8
        //% steering.min=-100 steering=100
        //% inlineInputMode=inline
        //% group="Chassis"
        moveSteering(steering: number, speed: number, value: number, unit: MoveUnit) {
            speed = Math.clamp(-100, 100, speed >> 0);
            if (!speed) {
                stop(this._ports);
                return;
            }

            const turnRatio = Math.clamp(-200, 200, steering + 100 >> 0);
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

            syncMotors(this._ports, {
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
        //% blockId=motorPairTank block="move tank %chassis|left %speedLeft|%|right %speedRight|%|by %value|%unit"
        //% weight=9 blockGap=8
        //% speedLeft.min=-100 speedLeft=100
        //% speedRight.min=-100 speedRight=100
        //% inlineInputMode=inline
        //% group="Chassis"
        moveTank(speedLeft: number, speedRight: number, value: number, unit: MoveUnit) {
            speedLeft = Math.clamp(speedLeft >> 0, -100, 100);
            speedRight = Math.clamp(speedRight >> 0, -100, 100);
            const steering = (speedRight * 100 / speedLeft) >> 0;
            this.moveSteering(speedLeft, steering, value, unit);
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