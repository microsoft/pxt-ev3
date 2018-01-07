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
            this._setMode(ColorSensorMode.None);
            this.thresholdDetector = new sensors.internal.ThresholdDetector(this.id());
        }

        _colorEventValue(value: number) {
            return 0xff00 | value;
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_COLOR
        }

        setMode(m: ColorSensorMode) {
            if (m == ColorSensorMode.AmbientLightIntensity) {
                this.thresholdDetector.setLowThreshold(5);
                this.thresholdDetector.setHighThreshold(20);
            } else {
                this.thresholdDetector.setLowThreshold(20);
                this.thresholdDetector.setHighThreshold(80);
            }
            this._setMode(m)
        }

        /**
         * Gets the current color mode
         */
        colorMode() {
            return <ColorSensorMode>this.mode;
        }

        _query() {
            if (this.mode == ColorSensorMode.Color
                || this.mode == ColorSensorMode.AmbientLightIntensity
                || this.mode == ColorSensorMode.ReflectedLightIntensity)
                return this.getNumber(NumberFormat.UInt8LE, 0)
            return 0
        }

        _update(prev: number, curr: number) {
            if (this.mode == ColorSensorMode.Color)
                control.raiseEvent(this._id, this._colorEventValue(curr));
            else
                this.thresholdDetector.setLevel(curr);
        }

        /**
         * Registers code to run when the given color is detected.
         * @param color the color to detect, eg: ColorSensorColor.Blue
         * @param handler the code to run when detected
         */
        //% help=sensors/color-sensor/on-color-detected
        //% block="on %sensor|detected color %color"
        //% blockId=colorOnColorDetected
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=100 blockGap=8
        //% group="Color Sensor"
        onColorDetected(color: ColorSensorColor, handler: () => void) {
            this.setMode(ColorSensorMode.Color)
            const v = this._colorEventValue(<number>color);
            control.onEvent(this._id, v, handler);
            if (this.color() == color)
                control.raiseEvent(this._id, v);
        }

        /**
         * Waits for the given color to be detected
         * @param color the color to detect
         */
        //% help=sensors/color-sensor/pause-for-color
        //% block="pause %sensor|for color %color"
        //% blockId=colorPauseForColorDetected
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=99 blockGap=8
        //% group="Color Sensor"
        pauseForColor(color: ColorSensorColor) {
            this.setMode(ColorSensorMode.Color);
            if (this.color() != color) {
                const v = this._colorEventValue(<number>color);
                control.waitForEvent(this._id, v);
            }
        }

        /**
         * Get the current color from the color sensor.
         * @param sensor the color sensor to query the request
         */
        //% help=sensors/color-sensor/color
        //% block="%sensor| color"
        //% blockId=colorGetColor
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
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
        //% block="on %sensor|%mode|%condition"
        //% blockId=colorOnLightChanged
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=89 blockGap=8
        //% group="Color Sensor"
        onLightChanged(mode: LightIntensityMode, condition: LightCondition, handler: () => void) {
            this.setMode(<ColorSensorMode><number>mode)
            control.onEvent(this._id, <number>condition, handler);
        }

        /**
         * Waits for the given color to be detected
         * @param color the color to detect
         */
        //% help=sensors/color-sensor/pause-for-light
        //% block="pause %sensor|for %mode|%condition"
        //% blockId=colorPauseForLight
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=88 blockGap=8
        //% group="Color Sensor"
        pauseForLight(mode: LightIntensityMode, condition: LightCondition) {
            this.setMode(<ColorSensorMode><number>mode)
            if (this.thresholdDetector.state != <number>condition)
                control.waitForEvent(this._id, <number>condition)
        }

        /**
         * Measures the ambient or reflected light value from 0 (darkest) to 100 (brightest).
         * @param sensor the color sensor port
         */
        //% help=sensors/color-sensor/light
        //% block="%sensor|%mode"
        //% blockId=colorLight
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=87
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

    //% whenUsed block="color 3" weight=90 fixedInstance jres=icons.port3
    export const color3: ColorSensor = new ColorSensor(3)
    
    //% whenUsed block="color 1" weight=95 fixedInstance jres=icons.port1
    export const color1: ColorSensor = new ColorSensor(1)

    //% whenUsed block="color 2" weight=90 fixedInstance jres=icons.port2
    export const color2: ColorSensor = new ColorSensor(2)

    //% whenUsed block="color 4" weight=90 fixedInstance jres=icons.port4
    export const color4: ColorSensor = new ColorSensor(4)
}
