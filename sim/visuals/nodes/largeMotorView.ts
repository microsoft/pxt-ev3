/// <reference path="./staticView.ts" />

namespace pxsim.visuals {
    export class LargeMotorView extends StaticModuleView implements LayoutElement {

        private static ROTATING_ECLIPSE_ID = "1eb2ae58-2419-47d4-86bf-4f26a7f0cf61";

        private lastMotorAnimationId: any;

        constructor(port: number) {
            super(LARGE_MOTOR_SVG, "large-motor", NodeType.LargeMotor, port);
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
            // Max medium motor RPM is 170 according to http://www.cs.scranton.edu/~bi/2015s-html/cs358/EV3-Motor-Guide.docx
            const rotationsPerMinute = 170; // 170 rpm at speed 100
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
            const holeEl = this.content.getElementById(this.normalizeId(LargeMotorView.ROTATING_ECLIPSE_ID))
            const width = 34;
            const height = 34;
            const transform = `rotate(${angle} ${width / 2} ${height / 2})`;
            holeEl.setAttribute("transform", transform);
        }

        getWiringRatio() {
            return 0.62;
        }
    }
}