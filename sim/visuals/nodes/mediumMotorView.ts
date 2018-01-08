/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {

    export class MediumMotorView extends MotorView implements LayoutElement {

        constructor(port: number) {
            super(MEDIUM_MOTOR_SVG, "medium-motor", NodeType.MediumMotor, port, "medmotor_Hole");
        }

        public getPaddingRatio() {
            return 1 / 5;
        }

        protected renderMotorAngle(holeEl: Element, angle: number) {
            const width = 44.45;
            const height = 44.45;
            const transform = `translate(2 1.84) rotate(${angle % 360} ${width / 2} ${height / 2})`;
            holeEl.setAttribute("transform", transform);
        }
    }
}