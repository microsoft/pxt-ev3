namespace pxsim {
    const MIN_RAMP_SPEED = 3;

    export class MotorNode extends BaseNode {
        isOutput = true;
        private rotationsPerMilliSecond: number;

        // current state
        private angle: number = 0;
        private tacho: number = 0;
        private speed: number = 0;

        private started: boolean;
        private speedCmd: DAL;
        private speedCmdValues: number[];
        private speedCmdTacho: number;
        private speedCmdTime: number;
        private _synchedMotor: MotorNode; // non-null if synchronized
        private _inverted: boolean;

        private manualReferenceAngle: number = undefined;
        private manualAngle: number = undefined;

        constructor(port: number, large: boolean) {
            super(port);
            this.setLarge(large);
            this.setInverted(false);
        }

        isReady() {
            return !this.speedCmd;
        }

        getSpeed() {
            return Math.round(this.speed * this.invertedFactor());
        }

        getAngle() {
            return Math.round(this.angle * this.invertedFactor());
        }

        // returns the secondary motor if any
        getSynchedMotor() {
            return this._synchedMotor;
        }

        setSpeedCmd(cmd: DAL, values: number[]) {
            if (this.speedCmd != cmd ||
                JSON.stringify(this.speedCmdValues) != JSON.stringify(values))
                this.setChangedState();
            // new command TODO: values
            this.speedCmd = cmd;
            this.speedCmdValues = values;
            this.speedCmdTacho = this.tacho;
            this.speedCmdTime = pxsim.U.now();
            delete this._synchedMotor;
        }

        setSyncCmd(motor: MotorNode, cmd: DAL, values: number[]) {
            console.log(`motor: ${motor.port}, speed: ${values[0]}, turnRatio: ${values[0]}`);
            this.setSpeedCmd(cmd, values);
            this._synchedMotor = motor;
        }

        clearSpeedCmd() {
            delete this.speedCmd;
            delete this.speedCmdValues;
            delete this._synchedMotor;
            this.setChangedState();
        }

        clearSyncCmd() {
            if (this._synchedMotor)
                this.clearSpeedCmd();
        }

        setLarge(large: boolean) {
            this.id = large ? NodeType.LargeMotor : NodeType.MediumMotor;
            // large 170 rpm (https://education.lego.com/en-us/products/ev3-large-servo-motor/45502)
            this.rotationsPerMilliSecond = (large ? 170 : 250) / 60000;
        }

        setInverted(inverted: boolean) {
            this._inverted = inverted;
            this.setChangedState();
        }

        isInverted(): boolean {
            return this._inverted;
        }

        invertedFactor(): number {
            return this._inverted ? -1 : 1
        }

        isLarge(): boolean {
            return this.id == NodeType.LargeMotor;
        }

        reset() {
            // not sure what reset does...
        }

        clearCount() {
            this.tacho = 0;
            this.angle = 0;
        }

        stop() {
            this.started = false;
            this.clearSpeedCmd();
        }

        start() {
            this.started = true;
        }

        manualMotorDown() {
            this.manualReferenceAngle = this.angle;
            this.manualAngle = 0;
        }

        // position: 0, 360
        manualMotorAngle(angle: number) {
            this.manualAngle = angle;
        }

        manualMotorUp() {
            delete this.manualReferenceAngle;
            delete this.manualAngle;
        }

        updateState(elapsed: number) {
            //console.log(`motor: ${elapsed}ms - ${this.speed}% - ${this.angle}> - ${this.tacho}|`)
            const interval = Math.min(20, elapsed);
            let t = 0;
            while (t < elapsed) {
                let dt = interval;
                if (t + dt > elapsed) dt = elapsed - t;
                this.updateStateStep(dt);
                t += dt;
            }
        }

        private updateStateStep(elapsed: number) {
            if (this.manualAngle === undefined) {
                // compute new speed
                switch (this.speedCmd) {
                    case DAL.opOutputSpeed:
                    case DAL.opOutputPower:
                        // assume power == speed
                        // TODO: PID
                        this.speed = this.speedCmdValues[0];
                        break;
                    case DAL.opOutputTimeSpeed:
                    case DAL.opOutputTimePower:
                    case DAL.opOutputStepPower:
                    case DAL.opOutputStepSpeed: {
                        // ramp up, run, ramp down, <brake> using time
                        const speed = this.speedCmdValues[0];
                        const step1 = this.speedCmdValues[1];
                        const step2 = this.speedCmdValues[2];
                        const step3 = this.speedCmdValues[3];
                        const brake = this.speedCmdValues[4];
                        const isTimeCommand = this.speedCmd == DAL.opOutputTimePower || this.speedCmd == DAL.opOutputTimeSpeed;
                        const dstep = isTimeCommand
                            ? pxsim.U.now() - this.speedCmdTime
                            : this.tacho - this.speedCmdTacho;
                        if (step1 && dstep < step1) { // rampup
                            this.speed = speed * dstep / step1;
                            // ensure non-zero speed
                            this.speed = Math.max(MIN_RAMP_SPEED, Math.ceil(Math.abs(this.speed))) * Math.sign(speed);
                        }
                        else if (dstep < step1 + step2) // run
                            this.speed = speed;
                        else if (step2 && dstep < step1 + step2 + step3) {
                            this.speed = speed * (step1 + step2 + step3 - dstep)
                                / (step1 + step2 + step3) + 5;
                            // ensure non-zero speed
                            this.speed = Math.max(MIN_RAMP_SPEED, Math.ceil(Math.abs(this.speed))) * Math.sign(speed);
                        } else {
                            if (brake) this.speed = 0;
                            if (!isTimeCommand) {
                                // we need to patch the actual position of the motor when
                                // finishing the move as our integration step introduce errors
                                const deltaAngle = -Math.sign(speed) * (dstep - (step1 + step2 + step3));
                                if (deltaAngle) {
                                    this.angle += deltaAngle;
                                    this.tacho -= Math.abs(deltaAngle);
                                    this.setChangedState();
                                }
                            }
                            this.clearSpeedCmd();
                        }
                        break;
                    }
                    case DAL.opOutputStepSync:
                    case DAL.opOutputTimeSync: {
                        const otherMotor = this._synchedMotor;
                        const speed = this.speedCmdValues[0];
                        const turnRatio = this.speedCmdValues[1];
                        // if turnratio is negative, right motor at power level
                        // right motor -> this.port > otherMotor.port
                        if (Math.sign(this.port - otherMotor.port)
                            == Math.sign(turnRatio))
                            break; // handled in other motor code
                        const stepsOrTime = this.speedCmdValues[2];
                        const brake = this.speedCmdValues[3];
                        const dstep = this.speedCmd == DAL.opOutputTimeSync
                            ? pxsim.U.now() - this.speedCmdTime
                            : this.tacho - this.speedCmdTacho;
                        // 0 is special case, run infinite
                        if (!stepsOrTime || dstep < stepsOrTime)
                            this.speed = speed * this.invertedFactor();
                        else {
                            if (brake) this.speed = 0;
                            this.clearSpeedCmd();
                        }

                        // turn ratio is a bit weird to interpret
                        // see https://communities.theiet.org/blogs/698/1706
                        otherMotor.speed = this.speed * otherMotor.invertedFactor() * (100 - Math.abs(turnRatio)) / 100;

                        // clamp
                        this.speed = Math.max(-100, Math.min(100, this.speed >> 0));
                        otherMotor.speed = Math.max(-100, Math.min(100, otherMotor.speed >> 0));

                        // stop other motor if needed
                        if (!this._synchedMotor)
                            otherMotor.clearSpeedCmd();
                        break;
                    }
                }
            }
            else {
                // the user is holding the handle - so position is the angle
                this.speed = 0;
                // rotate by the desired angle change
                this.angle = this.manualReferenceAngle + this.manualAngle;
                this.setChangedState();
            }
            // don't round speed
            // compute delta angle
            const rotations = this.speed / 100 * this.rotationsPerMilliSecond * elapsed;
            const deltaAngle = rotations * 360;
            if (deltaAngle) {
                this.angle += deltaAngle;
                this.tacho += Math.abs(deltaAngle);
                this.setChangedState();
            }

            // if the motor was stopped or there are no speed commands,
            // let it coast to speed 0
            if ((this.manualReferenceAngle === undefined)
                && this.speed && !(this.started || this.speedCmd)) {
                // decay speed 5% per tick
                this.speed = Math.round(Math.max(0, Math.abs(this.speed) - 10) * sign(this.speed));
            }
        }
    }
}

namespace pxsim {
    // A re-implementation of Math.sign (since IE11 doesn't support it)
    export function sign(num: number) {
        return num ? num < 0 ? -1 : 1 : 0;
    }
}