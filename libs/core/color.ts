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
    //% block="none"
    None,
    //% block="black"
    Black,
    //% block="blue"
    Blue,
    //% block="green"
    Green,
    //% block="yellow"
    Yellow,
    //% block="red"
    Red,
    //% block="white"
    White,
    //% block="brown"
    Brown,
}

namespace input {

    //% fixedInstances
    export class ColorSensor extends internal.UartSensor {
        polling: boolean;

        constructor(port: number) {
            super(port)
            this.polling = false;
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_COLOR
        }

        setMode(m: ColorSensorMode) {
            this._setMode(m)
        }

        _initPolling() {
            if (!this.polling) {
                input.internal.unsafePollForChanges(
                    50, 
                    () => this.color(),
                    (prev, curr) => {
                        control.raiseEvent(this._id, curr);
                    })    
            }
        }

        /**
         * Registers code to run when the given color is detected
         * @param color the color to dtect
         * @param handler the code to run when detected
         */
        //% help=input/color/on-color-detected
        //% block="on %sensor|detected %color"
        //% blockId=colorOnColorDetected
        //% parts="colorsensor"
        //% blockNamespace=input
        //% weight=100 blockGap=8
        //% group="Color Sensor"
        onColorDetected(color: ColorSensorColor, handler: () => void) {
            this._initPolling();
            control.onEvent(this._id, <number>color, handler);
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
        //% group="Color Sensor"
        ambientLight() {
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
        //% group="Color Sensor"
        reflectedLight(): number {
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
        //% group="Color Sensor"
        color(): ColorSensorColor {
            this.setMode(ColorSensorMode.Color)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }
    }

    //% whenUsed block="color sensor 3" weight=95 fixedInstance
    export const color3: ColorSensor = new ColorSensor(3)
    
    //% whenUsed block="color sensor 1" weight=95 fixedInstance
    export const color1: ColorSensor = new ColorSensor(1)

    //% whenUsed block="color sensor 2" weight=95 fixedInstance
    export const color2: ColorSensor = new ColorSensor(2)

    //% whenUsed block="color sensor 4" weight=95 fixedInstance
    export const color4: ColorSensor = new ColorSensor(4)
}
