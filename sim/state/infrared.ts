/// <reference path="./sensor.ts"/>

namespace pxsim {
    export class RemoteState {
    }

    export enum InfraredSensorMode {
        None = -1,
        Proximity = 0,
        Seek = 1,
        RemoteControl = 2
    }

    export class InfraredSensorNode extends UartSensorNode {
        id = NodeType.InfraredSensor;

        private proximity: number = 50; // [0..100]

        constructor(port: number) {
            super(port);
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_IR;
        }

        setPromixity(proximity: number) {
            if (this.proximity != proximity) {
                this.proximity = proximity;
                this.setChangedState();
            }
        }

        getValue() {
            return this.proximity;
        }
    }
}