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

        constructor(port: number, large: boolean) {
            super(port);
            this.setLarge(large);
        }

        getSpeed() {
            return this.speed * (this.polarity  == 0 ? -1 : 1);
        }

        getAngle() {
            return this.angle;
        }

        setSpeedCmd(cmd: DAL, values: number[]) {
            this.speedCmd = cmd;
            this.speedCmdValues = values;
            this.speedCmdTacho = this.angle;
            this.speedCmdTime = pxsim.U.now();
        }

        clearSpeedCmd() {
            delete this.speedCmd;
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
        }

        start() {
            this.started = true;
        }

        updateState(elapsed: number) {
            console.log(`motor: ${elapsed}ms - ${this.speed}% - ${this.angle}> - ${this.tacho}|`)
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
                case DAL.opOutputStepSpeed:
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
                    this.speed = Math.round(this.speed); // integer only
                    break;
            }

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
                this.speed = Math.round(Math.max(0, Math.abs(this.speed) - 10) * Math.sign(this.speed));
            }
        }
    }
}