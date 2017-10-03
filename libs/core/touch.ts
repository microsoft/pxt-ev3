namespace input {

    //% fixedInstances
    export class TouchSensor extends internal.AnalogSensor {
        button: Button;

        constructor() {
            super()
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
    export const touchSensorImpl: TouchSensor = new TouchSensor()

    //% whenUsed block="touch sensor" weight=95 fixedInstance
    export const touchSensor: Button = touchSensorImpl.button
}
