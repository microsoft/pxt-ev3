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

        constructor(port: number) {
            super(port);
        }

        _query() {
            return this.readValue();
        }

        _info(): string {
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

        /**
         * Measure the ambient or reflected light value from 0 (darkest) to 100 (brightest). For raw reflection values, the range can be from 0 to 4096.
         * @param sensor the color sensor port
         */
        //% help=sensors/nxt-light-sensor/light
        //% block="**nxt light sensor** %this|%mode"
        //% blockId=nxtLight
        //% parts="nxtlightsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=99 blockGap=8
        //% subcategory="NXT"
        //% group="Light Sensor"
        light(mode: NXTLightSensorMode) {
            //this.setMode(<NXTLightSensorMode><number>mode);
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
         * Gets the raw light value.
         */
        //%
        readValue() {
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
            return this.readValue();
        }

        /**
         * Gets the ambient light value.
         */
        //%
        ambientLight() {
            return this.readValue();
        }
    }

    //% whenUsed block="2" weight=95 fixedInstance jres=icons.port2
    export const nxtLight2: NXTLightSensor = new NXTLightSensor(2);

    //% whenUsed block="1" weight=90 fixedInstance jres=icons.port1
    export const nxtLight1: NXTLightSensor = new NXTLightSensor(1);

    //% whenUsed block="3" weight=90 fixedInstance jres=icons.port3
    export const nxtLight3: NXTLightSensor = new NXTLightSensor(3);
    
    //% whenUsed block="4" weight=90 fixedInstance jres=icons.port4
    export const nxtLight4: NXTLightSensor = new NXTLightSensor(4);
}
