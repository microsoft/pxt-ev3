/// <reference path="./staticView.ts" />

namespace pxsim.visuals {
    export class GyroSensorView extends StaticModuleView implements LayoutElement {

        constructor(port: number) {
            super(GYRO_SVG, "gyro", NodeType.GyroSensor, port);
        }

        public getPaddingRatio() {
            return 1 / 4;
        }
    }
}