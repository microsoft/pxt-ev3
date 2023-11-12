const enum NXTLightSensorMode {
    //% block="reflected light (raw)"
    ReflectedLightRaw = 0,
    //% block="reflected light"
    ReflectedLight = 1,
    //% block="ambient light (raw)" blockHidden=true
    AmbientLightRaw = 2,
    //% block="ambient light" blockHidden=true
    AmbientLight = 3,
}

enum NXTLightIntensityMode {
    //% block="reflected light (raw)"
    ReflectedRaw = NXTLightSensorMode.ReflectedLightRaw,
    //% block="ambient light (raw)"
    Reflected = NXTLightSensorMode.ReflectedLight,
    //% block="ambient light (raw)" blockHidden=true
    AmbientRaw = NXTLightSensorMode.AmbientLightRaw,
    //% block="ambient light" blockHidden=true
    Ambient = NXTLightSensorMode.AmbientLight
}

namespace sensors {

    //% fixedInstances
    export class NXTLightSensor extends internal.AnalogSensor {

        // https://github.com/mindboards/ev3sources-xtended/blob/master/ev3sources/lms2012/lms2012/Linux_AM1808/sys/settings/typedata.rcf

        darkRefLight: number;
        lightRefLight: number;
        darkAmbientLight: number;
        lightAmbientLight: number;

        constructor(port: number) {
            super(port);
            this.darkRefLight = 3064;
            this.lightRefLight = 1016;
            this.darkAmbientLight = 3064;
            this.lightAmbientLight = 1016;
        }

        _query() {
            return [this.readValue()];
        }

        _info() {
            if (this.mode == NXTLightSensorMode.ReflectedLight || this.mode == NXTLightSensorMode.AmbientLight) {
                return [`${this._query()[0].toString()}%`];
            } else {
                return [this._query()[0].toString()];
            }
        }

        _update(prev: number, curr: number) {
            return this.readValue();
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_NXT_LIGHT;
        }

        setMode(m: number) {
            this._setMode(m);
        }

        /**
         * Gets the current light mode
         */
        lightMode() {
            return <NXTLightSensorMode>this.mode;
        }

        // This pin is not used by the NXT Analog Sensor
        _readPin6() {
            return 0;
        }

        /**
         * Measure the ambient or reflected light value from 0 (darkest) to 100 (brightest). For raw reflection values, the range can be from 0 to 4095.
         * @param sensor the color sensor port
         */
        //% help=sensors/nxt-light-sensor/light
        //% block="**nxt light sensor** $this|$mode"
        //% blockId=nxtLight
        //% parts="nxtlightsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=99 blockGap=8
        //% subcategory="NXT"
        //% group="Light Sensor"
        light(mode: NXTLightIntensityMode) {
            this.setMode(<NXTLightSensorMode><number>mode);
            this.poke();
            switch (mode) {
                case NXTLightIntensityMode.ReflectedRaw:
                    return this.reflectetLightRaw();
                case NXTLightIntensityMode.Reflected:
                    return this.reflectetLight();
                case NXTLightIntensityMode.AmbientRaw:
                    return this.ambientLightRaw();
                case NXTLightIntensityMode.Ambient:
                    return this.ambientLight();
                default:
                    return 0;
            }
        }

        /**
         * Set the range of values for determining dark and light in light reflection mode. This must be done so that the reflection mode defines a value in the range from 0 to 100 percent.
         * @param sensor the color sensor port
         * @param dark the value of dark, eg: 0
         * @param light the value of light, eg: 4095
         */
        //% help=sensors/nxt-light-sensor/light
        //% block="**nxt light sensor** $this|set reflected range dark $dark|light $light"
        //% blockId=setReflectedLightRange
        //% parts="nxtlightsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=89 blockGap=8
        //% subcategory="NXT"
        //% group="Light Sensor"
        setReflectedLightRange(dark: number, light: number) {
            if (dark <= light) return;
            this.darkRefLight = Math.constrain(dark, 0, 4095);
            this.lightRefLight = Math.constrain(light, 0, 4095);
        }

        /**
         * Set the value range for dark and light detection in ambient light mode. This must be done so that the ambient light mode determines the value in the range from 0 to 100 percent.
         * @param sensor the color sensor port
         * @param dark the value of dark, eg: 0
         * @param light the value of light, eg: 4095
         */
        //% help=sensors/nxt-light-sensor/light
        //% block="**nxt light sensor** $this|set ambient range dark $dark|light $light"
        //% blockId=setAmbientLightRange
        //% parts="nxtlightsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=88 blockGap=8
        //% subcategory="NXT"
        //% group="Light Sensor"
        //% blockHidden=true
        setAmbientLightRange(dark: number, light: number) {
            if (dark <= light) return;
            this.darkAmbientLight = Math.constrain(dark, 0, 4095);
            this.lightAmbientLight = Math.constrain(light, 0, 4095);
        }

        /**
         * Gets the raw light value.
         */
        //%
        private readValue() {
            return this._readPin1();
        }

        /**
         * Gets the raw reflection light value.
         */
        //%
        reflectetLightRaw() {
            // ToDo: the red LED should be turned off in ambient lighting mode
            return this.readValue();
        }

        /**
         * Gets the raw ambient light value.
         */
        //%
        ambientLightRaw() {
            // ToDo: the red LED should be turned off in ambient lighting mode
            return this.readValue();
        }

        /**
         * Gets the normalize reflection light value.
         */
        //%
        reflectetLight() {
            let reflectedVal = Math.map(this.readValue(), this.darkRefLight, this.lightRefLight, 0, 100);
            reflectedVal = Math.constrain(reflectedVal, 0, 100);
            return reflectedVal;
        }

        /**
         * Gets the normalize ambient light value.
         */
        //%
        ambientLight() {
            let ambientVal = Math.map(this.readValue(), this.darkAmbientLight, this.lightAmbientLight, 0, 100);
            ambientVal = Math.constrain(ambientVal, 0, 100);
            return ambientVal;
        }
    }

    //% whenUsed block="1" weight=95 fixedInstance jres=icons.port1
    export const nxtLight1: NXTLightSensor = new NXTLightSensor(1);

    //% whenUsed block="2" weight=90 fixedInstance jres=icons.port2
    export const nxtLight2: NXTLightSensor = new NXTLightSensor(2);

    //% whenUsed block="3" weight=90 fixedInstance jres=icons.port3
    export const nxtLight3: NXTLightSensor = new NXTLightSensor(3);
    
    //% whenUsed block="4" weight=90 fixedInstance jres=icons.port4
    export const nxtLight4: NXTLightSensor = new NXTLightSensor(4);
}
