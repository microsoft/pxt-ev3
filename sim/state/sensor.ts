namespace pxsim {

    export class SensorNode extends BaseNode {

        protected mode: number;
        protected valueChanged: boolean;
        protected modeChanged: boolean;
        protected modeReturnArr: boolean;

        constructor(port: number) {
            super(port);
        }

        public isUart() {
            return true;
        }

        public isAnalog() {
            return false;
        }

        public isNXT() {
            return false;
        }

        public isModeReturnArr() {
            return this.modeReturnArr;
        }

        public getValue() {
            return 0;
        }

        public getValues() {
            return [0];
        }

        public getAnalogReadPin() {
            return AnalogOff.InPin6; // Defl for ev3 sensor
        }

        setMode(mode: number) {
            this.mode = mode;
            this.changed = true;
            this.modeChanged = true;
            this.modeReturnArr = false;
        }

        getMode() {
            return this.mode;
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_NONE;
        }

        public hasData() {
            return true;
        }

        valueChange() {
            const res = this.valueChanged;
            this.valueChanged = false;
            return res;
        }

        modeChange() {
            const res = this.modeChanged;
            this.modeChanged = false;
            return res;
        }

        setChangedState() {
            this.changed = true;
            this.valueChanged = false;
        }
    }

    export class AnalogSensorNode extends SensorNode {

        constructor(port: number) {
            super(port);
        }

        public isUart() {
            return false;
        }

        public isAnalog() {
            return true;
        }
    }

    export class UartSensorNode extends SensorNode {

        constructor(port: number) {
            super(port);
        }

        hasChanged() {
            return this.changed;
        }
    }

}