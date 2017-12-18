/// <reference path="./staticView.ts" />

namespace pxsim.visuals {
    export class ColorSensorView extends StaticModuleView implements LayoutElement {

        private control: ColorGridControl;

        constructor(port: number) {
            super(COLOR_SENSOR_SVG, "color", NodeType.ColorSensor, port);
        }

        public getPaddingRatio() {
            return 1 / 8;
        }
    }
}