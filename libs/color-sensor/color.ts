const enum ColorSensorMode {
    None = -1,
    //% block="reflected light intensity"
    ReflectedLightIntensity = 0,
    //% block="ambient light intensity"
    AmbientLightIntensity = 1,
    //% block="color"
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

namespace sensors {

    /**
     * The color sensor is a digital sensor that can detect the color or intensity
     * of light that enters the small window on the face of the sensor.
     */
    //% fixedInstances
    export class ColorSensor extends internal.UartSensor {
        constructor(port: number) {
            super(port)
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_COLOR
        }

        setColorMode(m: ColorSensorMode) {
            this._setMode(m)
        }

        /**
         * Gets the current color mode
         */
        colorMode() { 
            return <ColorSensorMode>this.mode;
        }

        _query() {
            if (this.mode == ColorSensorMode.Color)
                return this.getNumber(NumberFormat.UInt8LE, 0)
            return 0
        }

        _update(prev: number, curr: number) {
            if (this.mode == ColorSensorMode.Color)
                control.raiseEvent(this._id, curr);
        }

        /**
         * Registers code to run when the given color is detected.
         * @param color the color to detect, eg: ColorSensorColor.Blue
         * @param handler the code to run when detected
         */
        //% help=sensors/color-sensor/on-color-detected
        //% block="on `icons.colorSensor` %sensor|detected color %color"
        //% blockId=colorOnColorDetected
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% weight=100 blockGap=8
        //% group="Color Sensor"
        onColorDetected(color: ColorSensorColor, handler: () => void) {
            control.onEvent(this._id, <number>color, handler);
            this.setColorMode(ColorSensorMode.Color)
            if (this.color() == color)
                control.raiseEvent(this._id, <number>color);
        }

        /**
         * Get the current color from the color sensor.
         * @param color the color sensor to query the request
         */
        //% help=sensors/color-sensor/color
        //% block="`icons.colorSensor` %color| color"
        //% blockId=colorGetColor
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% weight=66 blockGap=8
        //% group="Color Sensor"
        color(): ColorSensorColor {
            this.setColorMode(ColorSensorMode.Color)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        /**
         * Measures the ambient light value from 0 (darkest) to 100 (brightest).
         * @param color the color sensor port
         */
        //% help=sensors/color-sensor/ambient-light
        //% block="`icons.colorSensor` %color| ambient light"
        //% blockId=colorGetAmbient
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% weight=65 blockGap=8
        //% group="Color Sensor"
        ambientLight() {
            this.setColorMode(ColorSensorMode.AmbientLightIntensity)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        /**
         * Measures the reflected light value from 0 (darkest) to 100 (brightest).
         * @param color the color sensor port
         */
        //% help=sensors/color-sensor/reflected-light
        //% block="`icons.colorSensor` %color| reflected light"
        //% blockId=colorGetReflected
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% weight=64 blockGap=8
        //% group="Color Sensor"
        reflectedLight(): number {
            this.setColorMode(ColorSensorMode.ReflectedLightIntensity)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }
    }

    //% whenUsed block="1" weight=95 fixedInstance
    export const colorSensor1: ColorSensor = new ColorSensor(1)
    
    //% whenUsed block="3" weight=90 fixedInstance
    export const colorSensor3: ColorSensor = new ColorSensor(3)
    
    //% whenUsed block="2" weight=90 fixedInstance
    export const colorSensor2: ColorSensor = new ColorSensor(2)

    //% whenUsed block="4" weight=90 fixedInstance
    export const colorSensor4: ColorSensor = new ColorSensor(4)
}
