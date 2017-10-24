const enum GyroSensorMode {
    None = -1,
    Angle = 0,
    Rate = 1,
}

namespace input {
    //% fixedInstances
    export class GyroSensor extends internal.UartSensor {
        constructor() {
            super()
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_GYRO
        }

        setMode(m: GyroSensorMode) {
            this._setMode(m)
        }

        /**
         * Get the current angle from the gyroscope.
         * @param color the gyroscope to query the request
         */
        //% help=input/gyro/angle
        //% block="%color|angle"
        //% blockId=gyroGetAngle
        //% parts="gyroscope"
        //% blockNamespace=input
        //% weight=65 blockGap=8        
        angle() {
            this.setMode(GyroSensorMode.Angle)
            return this.getNumber(NumberFormat.Int16LE, 0)
        }

        /**
         * Get the current rotation rate from the gyroscope.
         * @param color the gyroscope to query the request
         */
        //% help=input/gyro/rate
        //% block="%color|rotation rate"
        //% blockId=gyroGetRate
        //% parts="gyroscope"
        //% blockNamespace=input
        //% weight=65 blockGap=8        
        rate() {
            this.setMode(GyroSensorMode.Rate)
            return this.getNumber(NumberFormat.Int16LE, 0)
        }
    }

    //% whenUsed
    export const gyro: GyroSensor = new GyroSensor()
}
