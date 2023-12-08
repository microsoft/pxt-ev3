/// <reference path="./sensor.ts"/>

namespace pxsim {

    export enum NXTLightSensorMode {
        None = -1,
        ReflectedLightRaw = 0,
        ReflectedLight = 1,
        AmbientLightRaw = 2,
        AmbientLight = 3,
    }

    export class NXTLightSensorNode extends AnalogSensorNode {
        
        id = NodeType.NXTLightSensor;

        private value: number = 0;
        public darkReflectedLight: number = 3372;
        public brightReflectedLight: number = 445;
        public darkAmbientLight: number = 3411;
        public brightAmbientLight: number = 633;

        constructor(port: number) {
            super(port);
            this.mode = -1;
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_NXT_LIGHT;
        }

        setValue(value: number) {
            this.value = value;
            this.setChangedState();
        }

        getValue() {
            return this.value;
        }

        setMode(mode: number) {
            this.mode = mode;
            if (this.mode == NXTLightSensorMode.ReflectedLight) this.value = 1908;
            else if (this.mode == NXTLightSensorMode.AmbientLight) this.value = 2022;
            else this.value = 2048;
            this.changed = true;
            this.modeChanged = true;
        }

        getAnalogReadPin() {
            return AnalogOff.InPin1;
        }

        isNXT() {
            return true;
        }
    }
}