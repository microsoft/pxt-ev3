namespace input {
    export class TouchSensor extends internal.AnalogSensor {
        button: ButtonWrapper;

        constructor() {
            super()
            this.button = new ButtonWrapper()
        }

        _query() {
            return this._readPin6() > 2500 ? 1 : 0
        }

        _update(prev: number, curr: number) {
            this.button.update(curr > 0)
        }
    }

    //% whenUsed
    export const touch: TouchSensor = new TouchSensor()
}
