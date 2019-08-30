/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export abstract class MotorView extends ModuleView implements LayoutElement {

        protected motorLabelGroup: SVGGElement;
        protected motorLabel: SVGTextElement;
        private currentLabel: string;

        constructor(xml: string, prefix: string, id: NodeType, port: NodeType,
            protected rotating_hole_id: string) {
            super(xml, prefix, id, port);
        }

        updateState() {
            super.updateState();
            const motorState = ev3board().getMotors()[this.port];
            if (!motorState) return;
            const speed = motorState.getSpeed();

            this.setMotorAngle(motorState.getAngle() % 360);
            this.setMotorLabel(speed);
        }

        private setMotorAngle(angle: number) {
            const holeEl = this.content.getElementById(this.normalizeId(this.rotating_hole_id))
            this.renderMotorAngle(holeEl, angle);
        }

        protected abstract renderMotorAngle(holeEl: Element, angle: number): void;


        getWiringRatio() {
            return 0.37;
        }

        setMotorLabel(speed: number, force?: boolean) {
            if (!force && this.currentLabel === `${speed}`) return;
            this.currentLabel = `${speed}`;
            if (!this.motorLabel) {
                this.motorLabelGroup = pxsim.svg.child(this.content, "g") as SVGGElement;
                this.motorLabel = pxsim.svg.child(this.motorLabelGroup, "text", { 'text-anchor': 'middle', 'x': '0', 'y': '0', 'class': 'sim-text number inverted' }) as SVGTextElement;
            }
            this.motorLabel.textContent = `${this.currentLabel}%`;
            this.positionMotorLabel();
        }

        protected abstract positionMotorLabel(): void;
    }
}