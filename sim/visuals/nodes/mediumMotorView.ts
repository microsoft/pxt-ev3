/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {

    export class MediumMotorView extends MotorView implements LayoutElement {

        constructor(port: number) {
            super(MEDIUM_MOTOR_SVG, "medium-motor", NodeType.MediumMotor, port, "medmotor_Hole");
        }

        private syncedMotor: MotorNode;
        private syncedLabelG: SVGGElement;

        updateState() {
            super.updateState();
            const motorState = ev3board().getMotors()[this.port];
            if (!motorState) return;

            const syncedMotor = motorState.getSynchedMotor();
            if ((syncedMotor || this.syncedMotor) && syncedMotor != this.syncedMotor) {
                this.syncedMotor = syncedMotor;
                if (this.syncedMotor) {
                    this.showSyncedLabel(motorState, syncedMotor);
                } else if (this.syncedLabelG) {
                    this.syncedLabelG.parentNode.removeChild(this.syncedLabelG);
                }
                this.setMotorLabel(motorState.getSpeed(), motorState.isInverted(), true);
            }
            this.setMotorLabel(motorState.getSpeed(), motorState.isInverted());
        }

        protected optimizeForLightMode() {
            (this.content.getElementById(this.normalizeId('medmotor_box_wgradient')) as SVGElement).style.fill = '#a8aaa8';
        }

        public getPaddingRatio() {
            return 1 / 8;
        }

        getWiringRatio() {
            return 0.5;
        }

        private showSyncedLabel(motorNode: MotorNode, syncedMotor: MotorNode) {
            const a = String.fromCharCode('A'.charCodeAt(0) + motorNode.port);
            const b = String.fromCharCode('A'.charCodeAt(0) + syncedMotor.port);

            this.syncedLabelG = pxsim.svg.child(this.element, 'g', {'transform': 'translate(10 20), scale(0.5)'}) as SVGGElement;
            pxsim.svg.child(this.syncedLabelG, 'rect', {'rx': 15, 'ry': 15, 'x': 0, 'y': 0, 'width': 84, 'height': 34, 'fill': '#A8A9A8'});
            pxsim.svg.child(this.syncedLabelG, 'circle', {'cx': 17, 'cy': 17, 'r': 15, 'fill': 'white'});
            const leftLabel = pxsim.svg.child(this.syncedLabelG, 'text', {'transform': 'translate(11, 22)', 'class': 'no-drag', 'style': 'isolation: isolate;font-size: 16px;fill: #A8A9A8;font-family: ArialMT, Arial'});
            leftLabel.textContent = a;

            pxsim.svg.child(this.syncedLabelG, 'rect', {'rx': 0, 'ry': 0, 'x': 37, 'y': 12, 'width': 10, 'height': 3, 'fill': '#ffffff'});
            pxsim.svg.child(this.syncedLabelG, 'rect', {'rx': 0, 'ry': 0, 'x': 37, 'y': 18, 'width': 10, 'height': 3, 'fill': '#ffffff'});
            
            pxsim.svg.child(this.syncedLabelG, 'circle', {'cx': 67, 'cy': 17, 'r': 15, 'fill': 'white'});
            const rightLabel = pxsim.svg.child(this.syncedLabelG, 'text', {'transform': 'translate(61, 22)', 'class': 'no-drag', 'style': 'isolation: isolate;font-size: 16px;fill: #A8A9A8;font-family: ArialMT, Arial'});
            rightLabel.textContent = b;
        }

        protected renderMotorAngle(holeEl: Element, angle: number) {
            const width = 44.45;
            const height = 44.45;
            const transform = `translate(2 1.84) rotate(${angle} ${width / 2} ${height / 2})`;
            holeEl.setAttribute("transform", transform);
        }

        protected positionMotorLabel(reverse: boolean) {
            const hasSyncedLabel = this.syncedMotor;
            this.motorLabelGroup.setAttribute('transform', 'translate(25 45)');
            this.motorLabel.style.fontSize = '11px';
            if (reverse) {
                this.motorReverseLabelGroup.setAttribute('transform', `translate(${hasSyncedLabel ? '25 5' : '25 25'})`);
                this.motorReverseLabel.style.fontSize = '9px';
            }
        }
    }
}