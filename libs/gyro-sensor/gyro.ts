const enum GyroSensorMode {
    None = -1,
    Angle = 0,
    Rate = 1,
}

namespace sensors {
    //% fixedInstances
    export class GyroSensor extends internal.UartSensor {
        constructor(port: number) {
            super(port)
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_GYRO
        }

        setMode(m: GyroSensorMode) {
            this._setMode(m)
        }

        /**
         * Get the current angle from the gyroscope.
         * @param sensor the gyroscope to query the request
         */
        //% help=input/gyro/angle
        //% block="%sensor|angle"
        //% blockId=gyroGetAngle
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% weight=65 blockGap=8
        //% group="Gyro Sensor"
        angle(): number {
            this.setMode(GyroSensorMode.Angle)
            return this.getNumber(NumberFormat.Int16LE, 0)
        }

        /**
         * Get the current rotation rate from the gyroscope.
         * @param sensor the gyroscope to query the request
         */
        //% help=input/gyro/rate
        //% block="%sensor|rotation rate"
        //% blockId=gyroGetRate
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% weight=65 blockGap=8        
        //% group="Gyro Sensor"
        rate(): number {
            this.setMode(GyroSensorMode.Rate)
            return this.getNumber(NumberFormat.Int16LE, 0)
        }
    }

    //% fixedInstance whenUsed block="gyro 1" jres=icons.port1
    export const gyro1: GyroSensor = new GyroSensor(1)

    //% fixedInstance whenUsed block="gyro 2" weight=95 jres=icons.port2
    export const gyro2: GyroSensor = new GyroSensor(2)

    //% fixedInstance whenUsed block="gyro 3" jres=icons.port3
    export const gyro3: GyroSensor = new GyroSensor(3)

    //% fixedInstance whenUsed block="gyro 4" jres=icons.port4
    export const gyro4: GyroSensor = new GyroSensor(4)
}
