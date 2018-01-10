namespace pxsim {

    export class MotorNode extends BaseNode {
        isOutput = true;
        private rotationsPerMilliSecond: number;

        // current state
        private angle: number = 0;
        private tacho: number = 0;
        private speed: number = 0;
        private polarity: number = 1; // -1, 1 or -1

        private started: boolean;
        private speedCmd: DAL;
        private speedCmdValues: number[];
        private speedCmdTacho: number;
        private speedCmdTime: number;
        private _synchedMotor: MotorNode; // non-null if synchronized

        constructor(port: number, large: boolean) {
            super(port);
            this.setLarge(large);
        }

        isReady() {
            return !this.speedCmd;
        }

        getSpeed() {
            return this.speed * (this.polarity == 0 ? -1 : 1);
        }

        getAngle() {
            return this.angle;
        }

        // returns the slave motor if any
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
            this.speedCmdTacho = this.angle;
            this.speedCmdTime = pxsim.U.now();
            delete this._synchedMotor;
        }

        setSyncCmd(motor: MotorNode, cmd: DAL, values: number[]) {
            this.setSpeedCmd(cmd, values);
            this._synchedMotor = motor;
        }

        clearSpeedCmd() {
            delete this.speedCmd;
            delete this.speedCmdValues;
            delete this._synchedMotor;
        }

        setLarge(large: boolean) {
            this.id = large ? NodeType.LargeMotor : NodeType.MediumMotor;
            // large 170 rpm  (https://education.lego.com/en-us/products/ev3-large-servo-motor/45502)
            this.rotationsPerMilliSecond = (large ? 170 : 250) / 60000;
        }

        setPolarity(polarity: number) {
            // Either 1 or 255 (reverse)
            /*
                -1 : Motor will run backward  
                0 : Motor will run opposite direction  
                1 : Motor will run forward             
            */
            this.polarity = polarity;
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

        }

        manualMotorMove(angle: number) {

        }

        manualMotorUp() {

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
                    const dstep = (this.speedCmd == DAL.opOutputTimePower || this.speedCmd == DAL.opOutputTimeSpeed)
                        ? pxsim.U.now() - this.speedCmdTime
                        : this.tacho - this.speedCmdTacho;
                    if (dstep < step1) // rampup
                        this.speed = speed * dstep / step1;
                    else if (dstep < step1 + step2) // run
                        this.speed = speed;
                    else if (dstep < step1 + step2 + step3)
                        this.speed = speed * (step1 + step2 + step3 - dstep) / (step1 + step2 + step3);
                    else {
                        if (brake) this.speed = 0;
                        this.clearSpeedCmd();
                    }
                    break;
                }
                case DAL.opOutputStepSync:
                case DAL.opOutputTimeSync: {
                    const otherMotor = this._synchedMotor;
                    if (otherMotor.port < this.port) // handled in other motor code
                        break;

                    const speed = this.speedCmdValues[0];
                    const turnRatio = this.speedCmdValues[1];
                    const stepsOrTime = this.speedCmdValues[2];
                    const brake = this.speedCmdValues[3];
                    const dstep = this.speedCmd == DAL.opOutputTimeSync
                        ? pxsim.U.now() - this.speedCmdTime
                        : this.tacho - this.speedCmdTacho;
                    // 0 is special case, run infinite
                    if (!stepsOrTime || dstep < stepsOrTime)
                        this.speed = speed;
                    else {
                        if (brake) this.speed = 0;
                        this.clearSpeedCmd();
                    }

                    // turn ratio is a bit weird to interpret
                    // see https://communities.theiet.org/blogs/698/1706
                    if (turnRatio < 0) {
                        otherMotor.speed = speed;
                        this.speed *= (100 + turnRatio) / 100;
                    } else {
                        otherMotor.speed = this.speed * (100 - turnRatio) / 100;
                    }

                    // clamp
                    this.speed = Math.max(-100, Math.min(100, this.speed >> 0));
                    otherMotor.speed = Math.max(-100, Math.min(100, otherMotor.speed >> 0));;

                    // stop other motor if needed
                    if (!this._synchedMotor)
                        otherMotor.clearSpeedCmd();
                    break;
                }
            }
            this.speed = Math.round(this.speed); // integer only

            // compute delta angle
            const rotations = this.getSpeed() / 100 * this.rotationsPerMilliSecond * elapsed;
            const deltaAngle = Math.round(rotations * 360);
            if (deltaAngle) {
                this.angle += deltaAngle;
                this.tacho += Math.abs(deltaAngle);
                this.setChangedState();
            }

            // if the motor was stopped or there are no speed commands,
            // let it coast to speed 0
            if (this.speed && !(this.started || this.speedCmd)) {
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