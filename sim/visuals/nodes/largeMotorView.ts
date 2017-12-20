/// <reference path="./staticView.ts" />

namespace pxsim.visuals {
    export class LargeMotorView extends StaticModuleView implements LayoutElement {

        private static ROTATING_ECLIPSE_ID = "1eb2ae58-2419-47d4-86bf-4f26a7f0cf61";

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