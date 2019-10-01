namespace pxsim {
    export const enum GyroSensorMode {
        None = -1,
        Angle = 0,
        Rate = 1,
    }

    export class GyroSensorNode extends UartSensorNode {
        id = NodeType.GyroSensor;

        private rate: number = 0;

        constructor(port: number) {
            super(port);
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_GYRO;
        }

        setRate(rate: number) {
            rate = rate | 0;
            if (this.rate != rate) {
                this.rate = rate;
                this.setChangedState();
            }
        }

        getRate() {
            return this.rate;
        }

        getValue() {
            return this.getRate();
        }
    }
}