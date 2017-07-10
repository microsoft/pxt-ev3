namespace input {
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
            return LMS.DEVICE_TYPE_TOUCH
        }
    }

    //% whenUsed
    export const touch: TouchSensor = new TouchSensor()
}
