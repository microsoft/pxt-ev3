/// <reference path="./sensorView.ts" />

namespace pxsim.visuals {
    export class UltrasonicSensorView extends SensorView implements LayoutElement {

        constructor(port: number) {
            super(ULTRASONIC_SVG, "ultrasonic", NodeType.UltrasonicSensor, port);
        }
    }
}