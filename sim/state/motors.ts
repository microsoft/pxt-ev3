namespace pxsim {

    export abstract class MotorNode extends BaseNode {
        isOutput = true;

        protected angle: number = 0;

        private rotationsPerMilliSecond: number;
        private speed: number;
        private large: boolean;
        private rotation: number;
        private polarity: boolean;

        constructor(port: number, rpm: number) {
            super(port);
            this.rotationsPerMilliSecond = rpm / 60000;
        }

        setSpeed(speed: number) {
            if (this.speed != speed) {
                this.speed = speed;
                this.changed = true;
                this.setChangedState();
            }
        }

        setLarge(large: boolean) {
            this.large = large;
        }

        getSpeed() {
            return this.speed;
        }

        stepSpeed(speed: number, angle: number, brake: boolean) {
            // TODO: implement
        }

        setPolarity(polarity: number) {
            // Either 1 or 255 (reverse)
            this.polarity = polarity === 255;
            // TODO: implement
        }

        reset() {
            // TODO: implement
        }

        stop() {
            // TODO: implement
            this.setSpeed(0);
        }

        start() {
            // TODO: implement
            this.setChangedState();
        }

        public getAngle() {
            return this.angle;
        }

        updateState(elapsed: number) {
            const rotations = this.getSpeed() / 100 * this.rotationsPerMilliSecond * elapsed;
            const angle = rotations * 360;
            if (angle) {
                this.angle += angle;
                this.setChangedState();
            }
        }
    }

    export class MediumMotorNode extends MotorNode {
        id = NodeType.MediumMotor;

        constructor(port: number) {
            super(port, 250);
        }
    }

    export class LargeMotorNode extends MotorNode {
        id = NodeType.LargeMotor;

        constructor(port: number) {
            super(port, 170);
        }
    }
}