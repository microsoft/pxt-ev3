/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {

    export const MOTOR_ROTATION_FPS = 32;

    export class MediumMotorView extends ModuleView implements LayoutElement {

        private static ROTATING_ECLIPSE_ID = "Hole";

        private hasPreviousAngle: boolean;
        private previousAngle: number;

        constructor(port: number) {
            super(MEDIUM_MOTOR_SVG, "medium-motor", NodeType.MediumMotor, port);
        }

        public getPaddingRatio() {
            return 1 / 5;
        }

        updateState() {
            const motorState = ev3board().getMotors()[this.port];
            if (!motorState) return;
            const speed = motorState.getSpeed();

            if (!speed) return;
            this.setMotorAngle(motorState.getAngle());
        }

        private setMotorAngle(angle: number) {
            const holeEl = this.content.getElementById(this.normalizeId(MediumMotorView.ROTATING_ECLIPSE_ID))
            const width = 47.9;
            const height = 47.2;
            const transform = `translate(-1.5 -1.49) rotate(${angle} ${width / 2} ${height / 2})`;
            holeEl.setAttribute("transform", transform);
        }
    }
}