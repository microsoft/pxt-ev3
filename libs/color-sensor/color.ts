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

enum LightIntensityMode {
    //% block="reflected light"
    Reflected = ColorSensorMode.ReflectedLightIntensity,
    //% block="ambient light"
    Ambient = ColorSensorMode.AmbientLightIntensity
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

enum LightCondition {
    //% block="dark"
    Dark = sensors.internal.ThresholdState.Low,
    //$ block="bright"
    Bright = sensors.internal.ThresholdState.High
}

namespace sensors {

    /**
     * The color sensor is a digital sensor that can detect the color or intensity
     * of light that enters the small window on the face of the sensor.
     */
    //% fixedInstances
    export class ColorSensor extends internal.UartSensor {
        thresholdDetector: sensors.internal.ThresholdDetector;

        constructor(port: number) {
            super(port)
            this.thresholdDetector = new sensors.internal.ThresholdDetector(this.id());
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_COLOR
        }

        setMode(m: ColorSensorMode) {
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
            else
                this.thresholdDetector.setLevel(curr);
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
            this.setMode(ColorSensorMode.Color)
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
        //% weight=99
        //% group="Color Sensor"
        color(): ColorSensorColor {
            this.setMode(ColorSensorMode.Color)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        /**
         * Registers code to run when the ambient light changes.
         * @param condition the light condition
         * @param handler the code to run when detected
         */
        //% help=sensors/color-sensor/on-light-changed
        //% block="on `icons.colorSensor` %sensor|%mode|%condition"
        //% blockId=colorOnLightChanged
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% weight=89 blockGap=8
        //% group="Color Sensor"
        onLightChanged(mode: LightIntensityMode, condition: LightCondition, handler: () => void) { 
            control.onEvent(this._id, <number>condition, handler);
            this.setMode(<ColorSensorMode><number>mode)
        }

        /**
         * Measures the ambient or reflected light value from 0 (darkest) to 100 (brightest).
         * @param color the color sensor port
         */
        //% help=sensors/color-sensor/light
        //% block="`icons.colorSensor` %color|%mode"
        //% blockId=colorLight
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% weight=88
        //% group="Color Sensor"
        light(mode: LightIntensityMode) {
            this.setMode(<ColorSensorMode><number>mode)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        //%
        ambientLight() {
            return this.light(LightIntensityMode.Ambient);
        }

        //%
        reflectedLight() {
            return this.light(LightIntensityMode.Reflected);
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
