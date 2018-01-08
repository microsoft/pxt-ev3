/// <reference path="./moduleView.ts" />
/// <reference path="./motorView.ts" />

namespace pxsim.visuals {
    export class LargeMotorView extends MotorView implements LayoutElement {

        constructor(port: number) {
            super(LARGE_MOTOR_SVG, "large-motor", NodeType.LargeMotor, port, "hole");
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
            }
        }

        private showSyncedLabel(motorNode: MotorNode, syncedMotor: MotorNode) {
            const a = String.fromCharCode('A'.charCodeAt(0) + motorNode.port);
            const b = String.fromCharCode('A'.charCodeAt(0) + syncedMotor.port);

            this.syncedLabelG = pxsim.svg.child(this.element, 'g', {'transform': 'scale(0.5)'}) as SVGGElement;
            pxsim.svg.child(this.syncedLabelG, 'rect', {'rx': 15, 'ry': 15, 'x': 0, 'y': 0, 'width': 84, 'height': 34, 'fill': '#A8A9A8'});
            pxsim.svg.child(this.syncedLabelG, 'circle', {'cx': 17, 'cy': 17, 'r': 15, 'fill': 'white'});
            const leftLabel = pxsim.svg.child(this.syncedLabelG, 'text', {'transform': 'translate(11, 22)', 'style': 'isolation: isolate;font-size: 16px;fill: #A8A9A8;font-family: ArialMT, Arial'});
            leftLabel.textContent = a;

            pxsim.svg.child(this.syncedLabelG, 'rect', {'rx': 0, 'ry': 0, 'x': 37, 'y': 12, 'width': 10, 'height': 3, 'fill': '#ffffff'});
            pxsim.svg.child(this.syncedLabelG, 'rect', {'rx': 0, 'ry': 0, 'x': 37, 'y': 18, 'width': 10, 'height': 3, 'fill': '#ffffff'});
            
            pxsim.svg.child(this.syncedLabelG, 'circle', {'cx': 67, 'cy': 17, 'r': 15, 'fill': 'white'});
            const rightLabel = pxsim.svg.child(this.syncedLabelG, 'text', {'transform': 'translate(61, 22)', 'style': 'isolation: isolate;font-size: 16px;fill: #A8A9A8;font-family: ArialMT, Arial'});
            rightLabel.textContent = b;
        }

        protected renderMotorAngle(holeEl: Element, angle: number) {
            const width = 125.92;
            const height = 37.9;
            const transform = `rotate(${angle % 360} ${width / 2} ${height / 2})`;
            holeEl.setAttribute("transform", transform);
        }

        getWiringRatio() {
            return 0.37;
        }
    }
}