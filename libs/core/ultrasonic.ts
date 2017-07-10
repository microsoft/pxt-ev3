namespace input {

    export class UltraSonicSensor extends internal.UartSensor {
        constructor() {
            super()
        }

        _deviceType() {
            return LMS.DEVICE_TYPE_ULTRASONIC
        }

        /** Get distance in mm */
        getDistance() {
            // it supposedly also has an inch mode, but we stick to mm
            this._setMode(0)
            return this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff
        }
    }

    //% whenUsed
    export const ultrasonic: UltraSonicSensor = new UltraSonicSensor()
}
