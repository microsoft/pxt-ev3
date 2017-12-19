/// <reference path="./sensor.ts"/>

namespace pxsim {

    export enum ColorSensorMode {
        Reflected = 0,
        Ambient = 1,
        Colors = 2,
        RefRaw = 3,
        RgbRaw = 4,
        ColorCal = 5
    }

    export enum ThresholdState {
        Normal = 1,
        High = 2,
        Low = 3,
    }

    export class ColorSensorNode extends UartSensorNode {
        id = NodeType.ColorSensor;

        private color: number;

        constructor(port: number) {
            super(port);
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_COLOR;
        }
        
        setColor(color: number) {
            this.color = color;
            this.changed = true;
            this.valueChanged = true;
        }

        getValue() {
            return this.color;
        }
    }
}