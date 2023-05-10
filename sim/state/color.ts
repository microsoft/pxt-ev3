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
        private colors: number[] = [0, 0, 0];

        constructor(port: number) {
            super(port);
            this.mode = -1;
            this.modeReturnArr = false;
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_COLOR;
        }

        isModeReturnArr() {
            return this.modeReturnArr;
        }

        setColors(colors: number[]) {
            this.colors = colors;
            this.setChangedState();
        }

        setColor(colors: number) {
            this.color = colors;
            this.setChangedState();
        }

        getValue() {
            return this.color;
        }

        getValues() {
            return this.colors;
        }

        setMode(mode: number) {
            this.mode = mode;
            if (this.mode == ColorSensorMode.RefRaw) {
                this.color = 512;
                this.modeReturnArr = false;
            } else if (this.mode == ColorSensorMode.RgbRaw) {
                this.colors = [128, 128, 128];
                this.modeReturnArr = true;
            } else { // Reflection or ambiend light
                this.color = 50;
                this.modeReturnArr = false;
            }
            this.changed = true;
            this.modeChanged = true;
        }
    }
}