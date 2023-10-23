const enum NXTLightSensorMode {
    //% block="reflected light (raw)"
    ReflectedLightRaw = 0,
    //% block="reflected light"
    ReflectedLight = 1,
    //% block="ambient light"
    AmbientLight = 2,
}

namespace sensors {

    //% fixedInstances
    export class NXTLightSensor extends internal.AnalogSensor {

        darkValue: number;
        lightValue: number;

        constructor(port: number) {
            super(port);
            this.darkValue = 4096;
            this.lightValue = 0;
        }

        _query() {
            return this.readValue();
        }

        _info() {
            return this._query().toString();
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
         * Measure the ambient or reflected light value from 0 (darkest) to 100 (brightest). For raw reflection values, the range can be from 0 to 4096.
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
        light(mode: NXTLightSensorMode) {
            this.setMode(<NXTLightSensorMode><number>mode);
            this.poke();
            switch (mode) {
                case NXTLightSensorMode.ReflectedLightRaw:
                    return this.reflectetLightRaw();
                case NXTLightSensorMode.ReflectedLight:
                    return this.reflectetLight();
                case NXTLightSensorMode.AmbientLight:
                    return this.ambientLight();
                default:
                    return 0;
            }
        }

        /**
         * Set the minimum and maximum range of values for determining dark and light. This must be done so that the reflection and ambient lighting mode determines the value in the range from 0 to 100 percent.
         * @param sensor the color sensor port
         * @param dark the value of dark, eg: 0
         * @param light the value of light, eg: 4096
         */
        //% help=sensors/nxt-light-sensor/light
        //% block="**nxt light sensor** $this| set dark $dark|light $light"
        //% blockId=setRange
        //% parts="nxtlightsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=89 blockGap=8
        //% subcategory="NXT"
        //% group="Light Sensor"
        setRange(dark: number, light: number) {
            this.darkValue = dark;
            this.lightValue = light;
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
            return this.readValue();
        }

        /**
         * Gets the reflection light value.
         */
        //%
        reflectetLight() {
            let reflectedVal = Math.map(this.readValue(), this.lightValue, this.darkValue, 0, 100);
            reflectedVal = Math.constrain(reflectedVal, 0, 100);
            return reflectedVal;
        }

        /**
         * Gets the ambient light value.
         */
        //%
        ambientLight() {
            let ambientVal = Math.map(this.readValue(), this.lightValue, this.darkValue, 0, 100);
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
