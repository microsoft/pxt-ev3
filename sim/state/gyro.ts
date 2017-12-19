namespace pxsim {
    const enum GyroSensorMode {
        None = -1,
        Angle = 0,
        Rate = 1,
    }

    export class GyroSensorNode extends UartSensorNode {
        id = NodeType.GyroSensor;

        private angle: number = 0;
        private rate: number = 0;

        constructor(port: number) {
            super(port);
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_GYRO;
        }

        setAngle(angle: number) {
            if (this.angle != angle) {
                this.angle = angle;
                this.setChangedState();
            }
        }

        setRate(rate: number) {
            if (this.rate != rate) {
                this.rate = rate;
                this.setChangedState();
            }
        }

        getValue() {
            return this.mode == GyroSensorMode.Angle ? this.angle :
                this.mode == GyroSensorMode.Rate ? this.rate : 0;
        }
    }
}