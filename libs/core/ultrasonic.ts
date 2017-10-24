namespace input {

    //% fixedInstances
    export class UltraSonicSensor extends internal.UartSensor {
        constructor(port: number) {
            super(port)
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_ULTRASONIC
        }

        /**
         * Gets the distance from the sonar in millimeters
         * @param sensor the ultrasonic sensor port
         */
        //% help=input/ultrasonic/distance
        //% block="%sensor|distance"
        //% blockId=sonarGetDistance
        //% parts="ultrasonic"
        //% blockNamespace=input
        //% weight=65 blockGap=8   
        //% group="Ultrasonic Sensor"     
        distance() {
            // it supposedly also has an inch mode, but we stick to mm
            this._setMode(0)
            return this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff
        }
    }

    //% fixedInstance whenUsed block="ultrasonic sensor 4"
    export const ultrasonic4: UltraSonicSensor = new UltraSonicSensor(4)
    
    //% fixedInstance whenUsed block="ultrasonic sensor 1"
    export const ultrasonic1: UltraSonicSensor = new UltraSonicSensor(1)

    //% fixedInstance whenUsed block="ultrasonic sensor 2"
    export const ultrasonic2: UltraSonicSensor = new UltraSonicSensor(2)

    //% fixedInstance whenUsed block="ultrasonic sensor 3"
    export const ultrasonic3: UltraSonicSensor = new UltraSonicSensor(3)
}
