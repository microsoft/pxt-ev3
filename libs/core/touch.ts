namespace input {

    //% fixedInstances
    export class TouchSensor extends internal.AnalogSensor {
        button: Button;

        constructor(port: number) {
            super(port)
            this.button = new Button()
        }

        _query() {
            return this._readPin6() > 2500 ? 1 : 0
        }

        _update(prev: number, curr: number) {
            this.button.update(curr > 0)
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_TOUCH
        }
    }

    //% whenUsed
    export const touchSensorImpl1: TouchSensor = new TouchSensor(1)
    //% whenUsed
    export const touchSensorImpl2: TouchSensor = new TouchSensor(2)
    //% whenUsed
    export const touchSensorImpl3: TouchSensor = new TouchSensor(3)
    //% whenUsed
    export const touchSensorImpl4: TouchSensor = new TouchSensor(4)

    //% whenUsed block="touch sensor 1" weight=95 fixedInstance
    export const touchSensor1: Button = touchSensorImpl1.button

    //% whenUsed block="touch sensor 2" weight=95 fixedInstance
    export const touchSensor2: Button = touchSensorImpl2.button

    //% whenUsed block="touch sensor 3" weight=95 fixedInstance
    export const touchSensor3: Button = touchSensorImpl3.button

    //% whenUsed block="touch sensor 4" weight=95 fixedInstance
    export const touchSensor4: Button = touchSensorImpl4.button
}
