/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export abstract class MotorView extends ModuleView implements LayoutElement {

        constructor(xml: string, prefix: string, id: NodeType, port: NodeType,
            protected rotating_hole_id: string) {
            super(xml, prefix, id, port);
        }

        updateState() {
            super.updateState();
            const motorState = ev3board().getMotors()[this.port];
            if (!motorState) return;
            const speed = motorState.getSpeed();

            if (!speed) return;
            this.setMotorAngle(motorState.getAngle());
        }

        private setMotorAngle(angle: number) {
            const holeEl = this.content.getElementById(this.normalizeId(this.rotating_hole_id))
            this.renderMotorAngle(holeEl, angle);
        }

        protected abstract renderMotorAngle(holeEl: Element, angle: number): void;


        getWiringRatio() {
            return 0.37;
        }
    }
}