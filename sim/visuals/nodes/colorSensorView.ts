/// <reference path="./sensorView.ts" />

namespace pxsim.visuals {
    export class ColorSensorView extends SensorView implements LayoutElement {

        private control: ColorGridControl;

        private static sensor_hole_id = 'color_sensor_white_big';

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

            const colorState = ev3board().getInputNodes()[this.port];
            if (!colorState) return;
            const mode = colorState.getMode();

            switch (mode) {
                case ColorSensorMode.Colors: this.updateSensorLightVisual('#0062DD'); return; // blue
                case ColorSensorMode.Reflected: this.updateSensorLightVisual('#F86262'); return; // red
                case ColorSensorMode.Ambient: this.updateSensorLightVisual('#67C3E2'); return; // light blue
            }
            this.updateSensorLightVisual('#ffffff');
        }

        private updateSensorLightVisual(color: string) {
            const sensorHole = this.content.getElementById(this.normalizeId(ColorSensorView.sensor_hole_id)) as SVGCircleElement;
            sensorHole.style.stroke = color;
            if (color != '#ffffff') {
                sensorHole.style.strokeWidth = '2px';
            }
        }
    }
}