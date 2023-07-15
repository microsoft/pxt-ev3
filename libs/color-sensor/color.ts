const enum ColorSensorMode {
    //% block="reflected light intensity"
    ReflectedLightIntensity = 0,
    //% block="ambient light intensity"
    AmbientLightIntensity = 1,
    //% block="color"
    Color = 2,
    RefRaw = 3,
    RgbRaw = 4,
    Calibration = 5,
}

enum LightIntensityMode {
    //% block="reflected light"
    Reflected = ColorSensorMode.ReflectedLightIntensity,
    //% block="ambient light"
    Ambient = ColorSensorMode.AmbientLightIntensity,
    //% block="reflected light (raw)"
    ReflectedRaw = ColorSensorMode.RefRaw
}

const enum ColorSensorColor {
    //% block="none" blockIdentity=sensors.__colorEnumPicker
    None,
    //% block="black" blockIdentity=sensors.__colorEnumPicker
    Black,
    //% block="blue" blockIdentity=sensors.__colorEnumPicker
    Blue,
    //% block="green" blockIdentity=sensors.__colorEnumPicker
    Green,
    //% block="yellow" blockIdentity=sensors.__colorEnumPicker
    Yellow,
    //% block="red" blockIdentity=sensors.__colorEnumPicker
    Red,
    //% block="white" blockIdentity=sensors.__colorEnumPicker
    White,
    //% block="brown" blockIdentity=sensors.__colorEnumPicker
    Brown
}

enum Light {
    //% block="dark"
    Dark = sensors.ThresholdState.Low,
    //% block="bright"
    Bright = sensors.ThresholdState.High
}

namespace sensors {

    const MODE_SWITCH_DELAY = 10;

    /**
     * The color sensor is a digital sensor that can detect the color or intensity
     * of light that enters the small window on the face of the sensor.
     */
    //% fixedInstances
    export class ColorSensor extends internal.UartSensor {
        thresholdDetector: sensors.ThresholdDetector;
        calibrating: boolean;

        constructor(port: number) {
            super(port)
            this.thresholdDetector = new sensors.ThresholdDetector(this.id());
            this.calibrating = false;
        }

        _colorEventValue(value: number) {
            return 0xff00 | value;
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_COLOR
        }

        setMode(m: ColorSensorMode) {
            // don't change threshold after initialization
            if (m != this.mode && this.isActive()) { // If the new mode is different from what was set for the sensor
                //const previousValue = this.mode == ColorSensorMode.RgbRaw ? this._queryArr()[0] : this._query(); // Before changing the mode, remember what the value was
                this._setMode(m); // Change mode
                //const startChangeTime = control.millis();
                pause(MODE_SWITCH_DELAY);
                pauseUntil(() => (this.getStatus() == 8 && (this.mode == ColorSensorMode.RgbRaw ? this._queryArr()[0] : this._query()) < 1024)); // Pause until mode change
                /*
                const modeChangeTime = control.millis() - startChangeTime;
                control.dmesg(`Previous value ${previousValue} before mode change on port ${this._port}`);
                control.dmesg(`Value ${this.mode == ColorSensorMode.RgbRaw ? this._queryArr()[0] : this._query()} after mode change in port ${this._port}`);
                control.dmesg(`Time at mode change ${modeChangeTime} msec in port ${this._port}`);
                */
            } else {
                this._setMode(m);
            }
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
            else if (this.mode == ColorSensorMode.RefRaw)
                return this.getNumber(NumberFormat.UInt16LE, 0)
            return 0
        }

        _queryArr(): number[] {
            if (this.mode == ColorSensorMode.RgbRaw) {
                return [this.getNumber(NumberFormat.UInt16LE, 0), this.getNumber(NumberFormat.UInt16LE, 2), this.getNumber(NumberFormat.UInt16LE, 4)];
            }
            return [0, 0, 0];
        }

        _info(): string {
            switch (this.mode) {
                case ColorSensorMode.Color:
                    return ["none",
                        "black",
                        "blue",
                        "green",
                        "yellow",
                        "red",
                        "white",
                        "brown"][this._query()];
                case ColorSensorMode.AmbientLightIntensity:
                case ColorSensorMode.ReflectedLightIntensity:
                    return `${this._query()}%`;
                case ColorSensorMode.RgbRaw:
                    return "array";
                default:
                    return this._query().toString();
            }
        }

        _infoArr(): string[] {
            switch (this.mode) {
                case ColorSensorMode.RgbRaw:
                    const queryArr = this._queryArr().map(number => number.toString());
                    return queryArr;
                default:
                    return ["0", "0", "0"];
            }
        }

        _update(prev: number, curr: number) {
            if (this.calibrating) return; // simply ignore data updates while calibrating
            if (this.mode == ColorSensorMode.Color || this.mode == ColorSensorMode.RgbRaw || this.mode == ColorSensorMode.RefRaw)
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
        //% block="on **color sensor** %this|detected %color=colorEnumPicker"
        //% blockId=colorOnColorDetected
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=100 blockGap=12
        //% group="Color Sensor"
        onColorDetected(color: number, handler: () => void) {
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
        //% help=sensors/color-sensor/pause-until-color-detected
        //% block="pause until **color sensor** %this|detected %color=colorEnumPicker"
        //% blockId=colorpauseUntilColorDetectedDetected
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=99 blockGap=8
        //% group="Color Sensor"
        pauseUntilColorDetected(color: number) {
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
        //% block="**color sensor** %this| color"
        //% blockId=colorGetColor
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=98
        //% group="Color Sensor"
        //% blockGap=8
        color(): ColorSensorColor {
            this.setMode(ColorSensorMode.Color);
            this.poke();
            return this.getNumber(NumberFormat.UInt8LE, 0);
        }

        /**
         * Checks the color is being detected
         * @param color the color to detect
         */
        //% help=sensors/color-sensor/is-color-detected
        //% block="is **color sensor** %this|detected|%color=colorEnumPicker"
        //% blockId=colorisColorDetectedDetected
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=99 blockGap=8
        //% group="Color Sensor"
        isColorDetected(color: number) {
            return this.color() == color;
        }

        /**
         * Get the current raw rgb values as an array from the color sensor.
         * @param sensor the color sensor to query the request
         */
        //% help=sensors/color-sensor/rgbraw
        //% blockId=colorRgbRaw block="**color sensor** %this| RGB raw"
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=1
        //% group="Color Sensor"
        //% blockGap=8
        rgbRaw(): number[] {
            this.setMode(ColorSensorMode.RgbRaw);
            this.poke();
            return [this.getNumber(NumberFormat.UInt16LE, 0), this.getNumber(NumberFormat.UInt16LE, 2), this.getNumber(NumberFormat.UInt16LE, 4)];
        }

        /**
         * Registers code to run when the ambient light changes.
         * @param condition the light condition
         * @param handler the code to run when detected
         */
        //% help=sensors/color-sensor/on-light-detected
        //% block="on **color sensor** %this|%mode|%condition"
        //% blockId=colorOnLightDetected
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=89 blockGap=12
        //% group="Color Sensor"
        onLightDetected(mode: LightIntensityMode, condition: Light, handler: () => void) {
            this.setMode(<ColorSensorMode><number>mode)
            control.onEvent(this._id, <number>condition, handler);
        }

        /**
         * Wait for the given color to be detected
         * @param color the color to detect
         */
        //% help=sensors/color-sensor/pause-until-light-detected
        //% block="pause until **color sensor** %this|%mode|%condition"
        //% blockId=colorPauseUntilLightDetected
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=88 blockGap=8
        //% group="Color Sensor"
        pauseUntilLightDetected(mode: LightIntensityMode, condition: Light) {
            this.setMode(<ColorSensorMode><number>mode)
            if (this.thresholdDetector.state != <number>condition)
                control.waitForEvent(this._id, <number>condition)
        }

        /**
         * Measure the ambient or reflected light value from 0 (darkest) to 100 (brightest). In raw reflection light mode, the range will be different.
         * @param sensor the color sensor port
         */
        //% help=sensors/color-sensor/light
        //% block="**color sensor** %this|%mode"
        //% blockId=colorLight
        //% parts="colorsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=87 blockGap=8
        //% group="Color Sensor"
        light(mode: LightIntensityMode) {
            this.setMode(<ColorSensorMode><number>mode);
            this.poke();
            switch (mode) {
                case LightIntensityMode.ReflectedRaw:
                    return this.getNumber(NumberFormat.UInt16LE, 0);
                default:
                    return this.getNumber(NumberFormat.UInt8LE, 0);
            }
        }

        /**
         * Gets the ambient light
         */
        //%
        ambientLight() {
            return this.light(LightIntensityMode.Ambient);
        }

        /**
         * Gets the reflected light value
         */
        //%
        reflectedLight() {
            return this.light(LightIntensityMode.Reflected);
        }

        /**
         * Gets the raw reflection light value
         */
        //%
        reflectedLightRaw(): number {
            return this.light(LightIntensityMode.ReflectedRaw);
        }

        /**
         * Set a threshold value
         * @param condition the dark or bright light condition
         * @param value the value threshold, eg: 10
         */
        //% blockId=colorSetThreshold block="set **color sensor** %this|%condition|to %value"
        //% group="Calibration" blockGap=8 weight=90
        //% value.min=0 value.max=100
        //% this.fieldEditor="ports"
        //% help=sensors/color-sensor/set-threshold
        setThreshold(condition: Light, value: number) {
            // threshold is used in ambient or reflected modes
            if (this.mode != LightIntensityMode.Ambient &&
                this.mode != LightIntensityMode.Reflected)
                this.setMode(ColorSensorMode.ReflectedLightIntensity);

            if (condition == Light.Dark)
                this.thresholdDetector.setLowThreshold(value)
            else
                this.thresholdDetector.setHighThreshold(value);
        }

        /**
         * Get a threshold value
         * @param condition the light condition
         */
        //% blockId=colorGetThreshold block="**color sensor** %this|%condition"
        //% group="Calibration" weight=89
        //% this.fieldEditor="ports"
        //% help=sensors/color-sensor/threshold
        threshold(condition: Light): number {
            // threshold is used in ambient or reflected modes
            if (this.mode != LightIntensityMode.Ambient &&
                this.mode != LightIntensityMode.Reflected)
                this.setMode(ColorSensorMode.ReflectedLightIntensity);

            return this.thresholdDetector.threshold(<ThresholdState><number>condition);
        }

        /**
         * Collects measurement of the light condition and adjusts the threshold to 10% / 90%.
         */
        //% blockId=colorCalibrateLight block="calibrate **color sensor** %this|for %mode"
        //% group="Calibration" weight=91 blockGap=8
        //% this.fieldEditor="ports"
        //% help=sensors/color-sensor/calibrate-light
        calibrateLight(mode: LightIntensityMode, deviation: number = 8) {
            this.calibrating = true; // prevent events

            const statusLight = brick.statusLight(); // save current status light
            brick.setStatusLight(StatusLight.Orange);

            this.light(mode); // trigger a read
            pauseUntil(() => this.isActive(), 5000); // ensure sensor is live

            // check sensor is ready
            if (!this.isActive()) {
                brick.setStatusLight(StatusLight.RedFlash); // didn't work
                pause(2000);
                brick.setStatusLight(statusLight); // restore previous light
                return;
            }

            // calibrating
            brick.setStatusLight(StatusLight.OrangePulse);

            let vold = 0;
            let vcount = 0;
            let min = 200;
            let max = -200;
            let k = 0;
            while (k++ < 1000 && vcount < 50) {
                let v = this.light(mode);
                min = Math.min(min, v);
                max = Math.max(max, v);
                // detect if nothing has changed and stop calibration
                if (Math.abs(v - vold) <= 2)
                    vcount++;
                else {
                    vold = v;
                    vcount = 1;
                }

                // wait a bit
                pause(50);
            }

            // apply tolerance
            const minDist = 10;
            min = Math.max(minDist / 2, Math.min(min + deviation / 2, max - deviation / 2 - minDist / 2));
            max = Math.min(100 - minDist / 2, Math.max(min + minDist, max - deviation / 2));

            // apply thresholds
            this.thresholdDetector.setLowThreshold(min);
            this.thresholdDetector.setHighThreshold(max);

            brick.setStatusLight(StatusLight.Green); // success
            pause(1000);
            brick.setStatusLight(statusLight); // resture previous light

            this.calibrating = false;
        }

    }

    /**
     * Returns a color that the sensor can detect
     * @param color the color sensed by the sensor, eg: ColorSensorColor.Red
     */
    //% shim=TD_ID
    //% blockId=colorSensorColor block="color %color=colorEnumPicker"
    //% group="Color Sensor"
    //% weight=97
    //% help=sensors/color
    export function color(color: number): ColorSensorColor {
        return color;
    }

    //% whenUsed block="3" weight=95 fixedInstance jres=icons.port3
    export const color3: ColorSensor = new ColorSensor(3)

    //% whenUsed block="1" weight=90 fixedInstance jres=icons.port1
    export const color1: ColorSensor = new ColorSensor(1)

    //% whenUsed block="2" weight=90 fixedInstance jres=icons.port2
    export const color2: ColorSensor = new ColorSensor(2)

    //% whenUsed block="4" weight=90 fixedInstance jres=icons.port4
    export const color4: ColorSensor = new ColorSensor(4)
}