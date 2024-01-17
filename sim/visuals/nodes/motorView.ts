/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export abstract class MotorView extends ModuleView implements LayoutElement {

        protected motorLabelGroup: SVGGElement;
        protected motorLabel: SVGTextElement;
        protected motorReverseLabelGroup: SVGGElement;
        protected motorReverseLabel: SVGTextElement;
        private currentLabel: string;

        constructor(xml: string, prefix: string, id: NodeType, port: NodeType,
            protected rotating_hole_id: string) {
            super(xml, prefix, id, port);
        }

        updateState() {
            super.updateState();
            console.log(`updateState() before return`);
            const motorState = ev3board().getMotors()[this.port];
            if (!motorState) return;
            console.log(`updateState() after return`);
            const speed = motorState.getSpeed();
            //console.log(`speed: ${speed}, ${motorState.invertedFactor()}`);
            this.setMotorAngle((motorState.isInverted() ? 360 - motorState.getAngle() : motorState.getAngle()) % 360);
            this.setMotorLabel(speed, motorState.isInverted());
        }

        private setMotorAngle(angle: number) {
            const holeEl = this.content.getElementById(this.normalizeId(this.rotating_hole_id))
            this.renderMotorAngle(holeEl, angle);
        }

        protected abstract renderMotorAngle(holeEl: Element, angle: number): void;

        getWiringRatio() {
            return 0.37;
        }

        setMotorLabel(speed: number, reverse: boolean, force?: boolean) {
            if (!force && this.currentLabel === `${speed}`) return;
            this.currentLabel = `${speed}`;
            console.log(`reverse: ${reverse}, ${this.currentLabel}%`);
            if (!this.motorLabel) {
                this.motorLabelGroup = pxsim.svg.child(this.content, "g") as SVGGElement;
                this.motorLabel = pxsim.svg.child(this.motorLabelGroup, "text", { 'text-anchor': 'middle', 'x': '0', 'y': '0', 'class': 'sim-text number inverted' }) as SVGTextElement;
            }
            if (reverse && !this.motorReverseLabel) {
                this.motorReverseLabelGroup = pxsim.svg.child(this.content, "g") as SVGGElement;
                this.motorReverseLabel = pxsim.svg.child(this.motorReverseLabelGroup, "text", { 'text-anchor': 'middle', 'x': '0', 'y': '0', 'class': 'sim-text number inverted' }) as SVGTextElement;
            }
            this.motorLabel.textContent = `${this.currentLabel}%`;
            if (reverse) this.motorReverseLabel.textContent = "reverse";
            this.positionMotorLabel(reverse);
        }

        protected abstract positionMotorLabel(reverse: boolean): void;
    }
}