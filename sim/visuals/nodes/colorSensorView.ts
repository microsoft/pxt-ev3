/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export class ColorSensorView extends ModuleView implements LayoutElement {

        private control: ColorGridControl;

        constructor(port: number) {
            super(COLOR_SENSOR_SVG, "color", NodeType.ColorSensor, port);
        }

        protected optimizeForLightMode() {
            (this.content.getElementById(this.normalizeId('color_bigbox-2_path')) as SVGElement).style.fill = '#a8aaa8';
        }

        public getPaddingRatio() {
            return 1 / 4;
        }

        public updateState() {
            super.updateState();
            // TODO: show different color modes
        }
    }
}