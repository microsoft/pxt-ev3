namespace pxsim {

    export class MotorNode extends BaseNode {
        isOutput = true;

        public angle: number = 0;

        private speed: number;
        private large: boolean;
        private rotation: number;
        private polarity: boolean;

        constructor(port: number) {
            super(port);
        }

        setSpeed(speed: number) {
            if (this.speed != speed) {
                this.speed = speed;
                this.changed = true;
                runtime.queueDisplayUpdate();
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
        }

        start() {
            // TODO: implement
            runtime.queueDisplayUpdate();
        }
    }

    export class MediumMotorNode extends MotorNode {
        id = NodeType.MediumMotor;

        constructor(port: number) {
            super(port);
        }
    }

    export class LargeMotorNode extends MotorNode {
        id = NodeType.LargeMotor;

        constructor(port: number) {
            super(port);
        }

    }
}