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

        constructor(port: number) {
            super(port);
            this.mode = -1;
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_NXT_LIGHT;
        }

        setColor(value: number) {
            this.value = value;
            this.setChangedState();
        }

        getValue() {
            return this.value;
        }

        setMode(mode: number) {
            this.mode = mode;
            if (this.mode == NXTLightSensorMode.ReflectedLightRaw || this.mode == NXTLightSensorMode.AmbientLightRaw) {
                this.value = 2048;
            } else { // Reflection or ambiend light
                this.value = 50;
            }
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