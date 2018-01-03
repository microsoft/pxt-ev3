/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export class UltrasonicSensorView extends ModuleView implements LayoutElement {

        constructor(port: number) {
            super(ULTRASONIC_SVG, "ultrasonic", NodeType.UltrasonicSensor, port);
        }
    }
}