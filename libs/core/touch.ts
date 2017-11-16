// keep TouchSensorEvent in sync with ButtonEvent

/**
 * Touch sensor interactions
 */
const enum TouchSensorEvent {
    //% block="pressed"
    Pressed = 4,
    //% block="bumped"
    Bumped = 1,
    //% block="released"
    Released = 3,
}

namespace sensors {

    //% fixedInstances
    export class TouchSensor extends internal.AnalogSensor {
        private button: brick.Button;

        constructor(port: number) {
            super(port)
            this.button = new brick.Button();
        }

        _query() {
            return this._readPin6() > 2500 ? 1 : 0
        }

        _update(prev: number, curr: number) {
            this.button._update(curr > 0)
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_TOUCH
        }

        /**
         * Check if touch sensor is touched.
         * @param sensor the port to query the request
         */
        //% help=input/touch/is-touched
        //% block="%sensor|is touched"
        //% blockId=touchIsTouched
        //% parts="touch"
        //% blockNamespace=sensors
        //% weight=81 blockGap=8
        //% group="Touch Sensor"
        isTouched() {
            return this.button.isPressed();
        }

        /**
         * Do something when a touch sensor is touched...
         * @param sensor the touch sensor that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        //% help=input/touch/on-event
        //% blockId=touchEvent block="on %sensor|%event"
        //% parts="touch"
        //% blockNamespace=sensors
        //% weight=99 blockGap=8
        //% group="Touch Sensor"
        onEvent(ev: TouchSensorEvent, body: () => void) {
            this.button.onEvent(<ButtonEvent><number>ev, body)
        }
    }

    //% whenUsed block="`icons.touchSensor` 1" weight=95 fixedInstance
    export const touchSensor1: TouchSensor = new TouchSensor(1)
    //% whenUsed block="`icons.touchSensor` 2" weight=95 fixedInstance
    export const touchSensor2: TouchSensor = new TouchSensor(2)
    //% whenUsed block="`icons.touchSensor` 3" weight=95 fixedInstance
    export const touchSensor3: TouchSensor = new TouchSensor(3)
    //% whenUsed block="`icons.touchSensor` 4" weight=95 fixedInstance
    export const touchSensor4: TouchSensor = new TouchSensor(4)
}
