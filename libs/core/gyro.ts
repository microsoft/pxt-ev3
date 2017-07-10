const enum GyroSensorMode {
    None = -1,
    Angle = 0,
    Rate = 1,
}

namespace input {
    export class GyroSensor extends internal.UartSensor {
        constructor() {
            super()
        }

        _deviceType() {
            return LMS.DEVICE_TYPE_GYRO
        }

        setMode(m: GyroSensorMode) {
            this._setMode(m)
        }

        getAngle() {
            this.setMode(GyroSensorMode.Angle)
            return this.getNumber(NumberFormat.Int16LE, 0)
        }

        getRate() {
            this.setMode(GyroSensorMode.Rate)
            return this.getNumber(NumberFormat.Int16LE, 0)
        }
    }

    //% whenUsed
    export const gyro: GyroSensor = new GyroSensor()
}
