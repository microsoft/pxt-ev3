/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export class LargeMotorView extends ModuleView implements LayoutElement {

        private static ROTATING_ECLIPSE_ID = "hole";

        constructor(port: number) {
            super(LARGE_MOTOR_SVG, "large-motor", NodeType.LargeMotor, port);
        }

        updateState() {
            const motorState = ev3board().getMotors()[this.port];
            if (!motorState) return;
            const speed = motorState.getSpeed();

            if (!speed) return;
            this.setMotorAngle(motorState.getAngle());
        }

        private setMotorAngle(angle: number) {
            const holeEl = this.content.getElementById(this.normalizeId(LargeMotorView.ROTATING_ECLIPSE_ID))
            const width = 125.92;
            const height = 37.9;
            const transform = `rotate(${angle} ${width / 2} ${height / 2})`;
            holeEl.setAttribute("transform", transform);
        }

        getWiringRatio() {
            return 0.37;
        }
    }
}