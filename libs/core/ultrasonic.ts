namespace input {

    export class UltraSonicSensor extends internal.UartSensor {
        constructor(port: number) {
            super(port)
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_ULTRASONIC
        }

        /** Get distance in mm */
        getDistance() {
            // it supposedly also has an inch mode, but we stick to mm
            this._setMode(0)
            return this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff
        }
    }

    //% whenUsed
    export const ultrasonic1: UltraSonicSensor = new UltraSonicSensor(1)

    //% whenUsed
    export const ultrasonic2: UltraSonicSensor = new UltraSonicSensor(2)

    //% whenUsed
    export const ultrasonic3: UltraSonicSensor = new UltraSonicSensor(3)

    //% whenUsed
    export const ultrasonic4: UltraSonicSensor = new UltraSonicSensor(4)
}
