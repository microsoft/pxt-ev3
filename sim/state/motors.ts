namespace pxsim {

    export abstract class MotorNode extends BaseNode {
        isOutput = true;

        protected angle: number = 0;

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
                this.setChangedState();
                this.playMotorAnimation();
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
            this.setChangedState();
        }

        public getAngle() {
            return this.angle;
        }

        protected abstract playMotorAnimation(): void;
    }

    export class MediumMotorNode extends MotorNode {
        id = NodeType.MediumMotor;

        constructor(port: number) {
            super(port);
        }

        protected lastMotorAnimationId: number;
        protected playMotorAnimation() {
            // Max medium motor RPM is 250 according to http://www.cs.scranton.edu/~bi/2015s-html/cs358/EV3-Motor-Guide.docx
            const rotationsPerMinute = 250; // 250 rpm at speed 100
            const rotationsPerSecond = rotationsPerMinute / 60;
            const fps = GAME_LOOP_FPS;
            const rotationsPerFrame = rotationsPerSecond / fps;
            let now;
            let then = Date.now();
            let interval = 1000 / fps;
            let delta;
            let that = this;
            function draw() {
                that.lastMotorAnimationId = requestAnimationFrame(draw);
                now = Date.now();
                delta = now - then;
                if (delta > interval) {
                    then = now - (delta % interval);
                    const rotations = that.getSpeed() / 100 * rotationsPerFrame;
                    const angle = rotations * 360;
                    that.angle += angle;
                }
            }
            draw();
        }
    }

    export class LargeMotorNode extends MotorNode {
        id = NodeType.LargeMotor;

        constructor(port: number) {
            super(port);
        }

        protected lastMotorAnimationId: number;
        protected playMotorAnimation() {
            // Max medium motor RPM is 170 according to http://www.cs.scranton.edu/~bi/2015s-html/cs358/EV3-Motor-Guide.docx
            const rotationsPerMinute = 170; // 170 rpm at speed 100
            const rotationsPerSecond = rotationsPerMinute / 60;
            const fps = GAME_LOOP_FPS;
            const rotationsPerFrame = rotationsPerSecond / fps;
            let now;
            let then = Date.now();
            let interval = 1000 / fps;
            let delta;
            let that = this;
            function draw() {
                that.lastMotorAnimationId = requestAnimationFrame(draw);
                now = Date.now();
                delta = now - then;
                if (delta > interval) {
                    then = now - (delta % interval);
                    const rotations = that.getSpeed() / 100 * rotationsPerFrame;
                    const angle = rotations * 360;
                    that.angle += angle;
                }
            }
            draw();
        }
    }
}