/// <reference path="./sensor.ts"/>

namespace pxsim {
    export class UltrasonicSensorNode extends UartSensorNode {
        id = NodeType.UltrasonicSensor;

        private distance: number = 127; // in cm

        constructor(port: number) {
            super(port);
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_ULTRASONIC;
        }

        setDistance(distance: number) {
            if (this.distance != distance) {
                this.distance = distance;
                this.setChangedState();
            }
        }

        getValue() {
            return this.distance * 10; // convert to 0.1 cm
        }
    }
}