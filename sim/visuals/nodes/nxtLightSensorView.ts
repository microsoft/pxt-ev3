/// <reference path="./sensorView.ts" />

namespace pxsim.visuals {
    export class NXTLightSensorView extends SensorView implements LayoutElement {

        private control: LightWheelControl;

        private static sensor_hole_id = 'led';

        constructor(port: number) {
            super(NXT_LIGHT_SENSOR_SVG, "color", NodeType.NXTLightSensor, port);
        }

        protected optimizeForLightMode() {
            (this.content.getElementById(this.normalizeId('box')) as SVGElement).style.fill = '#a8aaa8';
        }

        public getPaddingRatio() {
            return 1 / 4;
        }

        public updateState() {
            super.updateState();

            const lightState = ev3board().getInputNodes()[this.port];
            if (!lightState) return;
            const mode = lightState.getMode();

            if (mode == NXTLightSensorMode.ReflectedLightRaw || mode == NXTLightSensorMode.ReflectedLight) {
                this.updateSensorLightVisual('#eb0c0c');
            } else {
                this.updateSensorLightVisual('#ffffff');
            }
        }

        private updateSensorLightVisual(color: string) {
            const sensorHole = this.content.getElementById(this.normalizeId(NXTLightSensorView.sensor_hole_id)) as SVGCircleElement;
            sensorHole.style.stroke = color;
            if (color != '#ffffff') {
                sensorHole.style.strokeWidth = '2px';
            }
        }
    }
}