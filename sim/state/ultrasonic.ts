/// <reference path="./sensor.ts"/>

namespace pxsim {
    export class UltrasonicSensorNode extends UartSensorNode {
        id = NodeType.UltrasonicSensor;

        private distance: number = 50;

        constructor(port: number) {
            super(port);
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_ULTRASONIC;
        }

        setDistance(distance: number) {
            if (this.distance != distance) {
                this.distance = distance;
                this.changed = true;
                this.valueChanged = true;

                runtime.queueDisplayUpdate();
            }
        }

        getValue() {
            return this.distance;
        }
    }
}