/// <reference path="./staticView.ts" />

namespace pxsim.visuals {
    export class UltrasonicSensorView extends StaticModuleView implements LayoutElement {

        constructor(port: number) {
            super(ULTRASONIC_SVG, "ultrasonic", NodeType.UltrasonicSensor, port);
        }
    }
}