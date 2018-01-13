const enum GyroSensorMode {
    None = -1,
    Angle = 0,
    Rate = 1,
}

namespace sensors {
    //% fixedInstances
    export class GyroSensor extends internal.UartSensor {
        private calibrating: boolean;
        private _drift: number;
        constructor(port: number) {
            super(port)
            this.calibrating = false;
            this._drift = 0;
            this.setMode(GyroSensorMode.Rate);
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_GYRO
        }

        _query(): number {
            return this.getNumber(NumberFormat.Int16LE, 0);
        }

        _update(prev: number, curr: number) {
            if (this.mode == GyroSensorMode.Rate) {
                // correct slow drift and ignore large rates
                if (Math.abs(curr) < 5) {
                    const p = 0.0005;
                    this._drift = (1 - p) * this._drift + p * curr;
                }
            }
        }

        setMode(m: GyroSensorMode) {
            if (m == GyroSensorMode.Rate && this.mode != m)
                this._drift = 0;
            this._setMode(m)
        }

        /**
         * Get the current angle from the gyroscope.
         * @param sensor the gyroscope to query the request
         */
        //% help=input/gyro/angle
        //% block="%sensor|angle"
        //% blockId=gyroGetAngle
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=64 blockGap=8
        //% group="Gyro Sensor"
        angle(): number {
            if (this.calibrating)
                pauseUntil(() => !this.calibrating, 2000);

            this.setMode(GyroSensorMode.Angle);
            return this._query();
        }

        /**
         * Get the current rotation rate from the gyroscope.
         * @param sensor the gyroscope to query the request
         */
        //% help=input/gyro/rate
        //% block="%sensor|rate"
        //% blockId=gyroGetRate
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=65 blockGap=8        
        //% group="Gyro Sensor"
        rate(): number {
            if (this.calibrating)
                pauseUntil(() => !this.calibrating, 2000);

            this.setMode(GyroSensorMode.Rate);
            return this._query() + Math.round(this._drift);
        }

        /**
         * Gets the computed rate drift
         */
        //%
        drift(): number {
            return this._drift;
        }

        /**
         * Forces a calibration of the gyro. Must be called when the sensor is completely still.
         */
        //% help=input/gyro/calibrate
        //% block="%sensor|reset"
        //% blockId=gyroReset  
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=50 blockGap=8        
        //% group="Gyro Sensor"
        reset(): void {
            if (this.calibrating) return; // already in calibration mode

            this.calibrating = true;
            // may be triggered by a button click, 
            // give time for robot to settle
            loops.pause(700);
            // send a reset command
            super.reset();
            // switch back to the desired mode
            this.setMode(this.mode);
            // wait till sensor is live
            pauseUntil(() => this.isActive());
            // clear drift
            this._drift = 0;
            // and we're done
            this.calibrating = false;
        }
    }

    //% fixedInstance whenUsed block="gyro 2" weight=95 jres=icons.port2
    export const gyro2: GyroSensor = new GyroSensor(2)

    //% fixedInstance whenUsed block="gyro 1" jres=icons.port1
    export const gyro1: GyroSensor = new GyroSensor(1)

    //% fixedInstance whenUsed block="gyro 3" jres=icons.port3
    export const gyro3: GyroSensor = new GyroSensor(3)

    //% fixedInstance whenUsed block="gyro 4" jres=icons.port4
    export const gyro4: GyroSensor = new GyroSensor(4)
}
