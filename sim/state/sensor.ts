
namespace pxsim {

    export class SensorNode extends BaseNode {

        protected mode: number;
        protected valueChanged: boolean;
        protected modeChanged: boolean;

        constructor(port: number) {
            super(port);
        }

        public isUart() {
            return true;
        }

        public isAnalog() {
            return false;
        }

        public getValue() {
            return 0;
        }

        setMode(mode: number) {
            this.mode = mode;
            this.changed = true;
            this.modeChanged = true;
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

    export class SensorExtendedNode extends BaseNode {

        protected mode: number;
        protected valueChanged: boolean;
        protected modeChanged: boolean;

        constructor(port: number) {
            super(port);
        }

        public isUart() {
            return true;
        }

        public isAnalog() {
            return false;
        }

        public getValue() {
            return [0];
        }

        setMode(mode: number) {
            this.mode = mode;
            this.changed = true;
            this.modeChanged = true;
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

    export class UartSensorExtendedNode extends SensorNode {

        constructor(port: number) {
            super(port);
        }

        hasChanged() {
            return this.changed;
        }

        public getValues() {
            return [0];
        }
    }

}