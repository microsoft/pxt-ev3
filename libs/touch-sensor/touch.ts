// keep TouchSensorEvent in sync with ButtonEvent

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
         * Do something when a touch sensor is touched...
         * @param sensor the touch sensor that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        //% help=input/touch-sensor/on-event
        //% blockId=touchEvent block="on %sensor|%event"
        //% parts="touch"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=99 blockGap=12
        //% group="Touch Sensor"
        onEvent(ev: ButtonEvent, body: () => void) {
            this.button.onEvent(ev, body)
        }

        /**
         * Wait until the touch sensor is touched
         * @param sensor the touch sensor that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         */
        //% help=input/touch-sensor/pause-until
        //% blockId=touchWaitUntil block="pause until %sensor|%event"
        //% parts="touch"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=98 blockGap=12
        //% group="Touch Sensor"
        pauseUntil(ev: ButtonEvent) {
            this.button.pauseUntil(<ButtonEvent><number>ev);
        }

        /**
         * Check if touch sensor is touched.
         * @param sensor the port to query the request
         */
        //% help=input/touch-sensor/is-pressed
        //% block="%sensor|is pressed"
        //% blockId=touchIsPressed
        //% parts="touch"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=81 blockGap=8
        //% group="Touch Sensor"
        isPressed() {
            return this.button.isPressed();
        }

        /**
         * Check if touch sensor is touched since it was last checked.
         * @param sensor the port to query the request
         */
        //% help=input/touch-sensor/was-pressed
        //% block="%sensor|was pressed"
        //% blockId=touchWasPressed
        //% parts="touch"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=81
        //% group="Touch Sensor"
        wasPressed() {
            return this.button.wasPressed();
        }
    }

    //% whenUsed block="touch 1" weight=95 fixedInstance jres=icons.port1
    export const touch1: TouchSensor = new TouchSensor(1)
    //% whenUsed block="touch 2" weight=95 fixedInstance jres=icons.port2
    export const touch2: TouchSensor = new TouchSensor(2)
    //% whenUsed block="touch 3" weight=95 fixedInstance jres=icons.port3
    export const touch3: TouchSensor = new TouchSensor(3)
    //% whenUsed block="touch 4" weight=95 fixedInstance jres=icons.port4
    export const touch4: TouchSensor = new TouchSensor(4)
}
