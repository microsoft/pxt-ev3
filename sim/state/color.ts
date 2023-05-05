/// <reference path="./sensor.ts"/>

namespace pxsim {

    export enum ColorSensorMode {
        None = -1,
        Reflected = 0,
        Ambient = 1,
        Colors = 2,
        RefRaw = 3,
        RgbRaw = 4,
        ColorCal = 5,
    }

    export enum ThresholdState {
        Normal = 1,
        High = 2,
        Low = 3,
    }

    export class ColorSensorNode extends UartSensorNode {
        id = NodeType.ColorSensor;

        private color: number = 0;

        constructor(port: number) {
            super(port);
            this.mode = -1;
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_COLOR;
        }

        setColor(color: number) {
            this.color = color;
            this.setChangedState();
        }

        getValue() {
            return this.color;
        }

        setMode(mode: number) {
            this.mode = mode;
            if (this.mode == ColorSensorMode.RefRaw) this.color = 512; 
            else this.color = 50;
            this.changed = true;
            this.modeChanged = true;
        }
    }
}