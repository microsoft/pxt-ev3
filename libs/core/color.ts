const enum ColorSensorMode {
    None = -1,
    Reflect = 0,
    Ambient = 1,
    Color = 2,
    RefRaw = 3,
    RgbRaw = 4,
    ColorCal = 5,
}

const enum ColorSensorColor {
    None,
    Black,
    Blue,
    Green,
    Yellow,
    Red,
    White,
    Brown,
}

namespace input {

    //% fixedInstances
    export class ColorSensor extends internal.UartSensor {
        constructor() {
            super()
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_COLOR
        }

        setMode(m: ColorSensorMode) {
            this._setMode(m)
        }

        /**
         * Get current ambient light value from the color sensor.
         * @param color the color sensor to query the request
         */
        //% help=input/color/ambient-light
        //% block="%color| ambient light"
        //% blockId=colorGetAmbient
        //% parts="colorsensor"
        //% blockNamespace=input
        //% weight=65 blockGap=8
        getAmbientLight() {
            this.setMode(ColorSensorMode.Ambient)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        /**
         * Get current reflected light value from the color sensor.
         * @param color the color sensor to query the request
         */
        //% help=input/color/refelected-light
        //% block="%color| reflected light"
        //% blockId=colorGetReflected
        //% parts="colorsensor"
        //% blockNamespace=input
        //% weight=64 blockGap=8
        getReflectedLight(): number {
            this.setMode(ColorSensorMode.Reflect)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        /**
         * Get the current color from the color sensor.
         * @param color the color sensor to query the request
         */
        //% help=input/color/color
        //% block="%color| color"
        //% blockId=colorGetColor
        //% parts="colorsensor"
        //% blockNamespace=input
        //% weight=66 blockGap=8
        getColor(): ColorSensorColor {
            this.setMode(ColorSensorMode.Color)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }
    }

    //% whenUsed block="color sensor" weight=95 fixedInstance
    export const color: ColorSensor = new ColorSensor()
}
