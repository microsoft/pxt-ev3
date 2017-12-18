/// <reference path="./staticView.ts" />

namespace pxsim.visuals {

    export const MOTOR_ROTATION_FPS = 32;

    export class MediumMotorView extends StaticModuleView implements LayoutElement {

        private static ROTATING_ECLIPSE_ID = "Hole";

        private hasPreviousAngle: boolean;
        private previousAngle: number;

        private lastMotorAnimationId: any;

        constructor(port: number) {
            super(MEDIUM_MOTOR_SVG, "medium-motor", NodeType.MediumMotor, port);
        }

        public getPaddingRatio() {
            return 1 / 10;
        }

        updateState() {
            const motorState = ev3board().getMotors()[this.port];
            if (!motorState) return;
            const speed = motorState.getSpeed();
            if (this.lastMotorAnimationId) cancelAnimationFrame(this.lastMotorAnimationId);

            if (!speed) return;
            this.playMotorAnimation(motorState);
        }

        private playMotorAnimation(state: MotorNode) {
            // Max medium motor RPM is 250 according to http://www.cs.scranton.edu/~bi/2015s-html/cs358/EV3-Motor-Guide.docx
            const rotationsPerMinute = 250; // 250 rpm at speed 100
            const rotationsPerSecond = rotationsPerMinute / 60;
            const fps = MOTOR_ROTATION_FPS;
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
                    that.playMotorAnimationStep(state.angle);
                    const rotations = state.getSpeed() / 100 * rotationsPerFrame;
                    const angle = rotations * 360;
                    state.angle += angle;
                }
            }
            draw();
        }

        private playMotorAnimationStep(angle: number) {
            const holeEl = this.content.getElementById(this.normalizeId(MediumMotorView.ROTATING_ECLIPSE_ID))
            const width = 47.9;
            const height = 47.2;
            const transform = `translate(-1.5 -1.49) rotate(${angle} ${width / 2} ${height / 2})`;
            holeEl.setAttribute("transform", transform);
        }
    }
}