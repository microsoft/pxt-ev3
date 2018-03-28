/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export class GyroSensorView extends ModuleView implements LayoutElement {

        constructor(port: number) {
            super(GYRO_SVG, "gyro", NodeType.GyroSensor, port);
        }

        protected optimizeForLightMode() {
            (this.content.getElementById(this.normalizeId('gyro_white_1')) as SVGElement).style.fill = '#7B7B7B';
            (this.content.getElementById(this.normalizeId('gyro_white_small_path')) as SVGElement).style.fill = '#7B7B7B';
        }

        public getPaddingRatio() {
            return 0.3;
        }
    }
}