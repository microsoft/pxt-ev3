namespace pxsim {

    export const TOUCH_SENSOR_ANALOG_PRESSED = 2600;

    export class TouchSensorNode extends AnalogSensorNode {
        id = NodeType.TouchSensor;

        private pressed: boolean[];

        constructor(port: number) {
            super(port);
            this.pressed = [];
        }

        public setPressed(pressed: boolean) {
            this.pressed.push(pressed);
            this.setChangedState();
        }

        public isPressed() {
            return this.pressed;
        }

        public getValue() {
            if (this.pressed.length) {
                if (this.pressed.pop())
                    return TOUCH_SENSOR_ANALOG_PRESSED;
            }
            return 0;
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_TOUCH;
        }

        public hasData() {
            return this.pressed.length > 0;
        }
    }
}

