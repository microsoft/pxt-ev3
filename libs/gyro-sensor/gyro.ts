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
        private _drifting: boolean;
        constructor(port: number) {
            super(port)
            this.calibrating = false;
            this._drift = 0;
            this._drifting = true;
            this.setMode(GyroSensorMode.Rate);
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_GYRO
        }

        _query(): number {
            return this.getNumber(NumberFormat.Int16LE, 0);
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
        //% help=sensors/gyro/angle
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
        //% help=sensors/gyro/rate
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
            let curr = this._query();
            if (Math.abs(curr) < 20) {
                const p = 0.0005;
                this._drift = (1 - p) * this._drift + p * curr;
                curr -= this._drift;
            }
            return curr;
        }

        /**
         * Forces a calibration of the gyro. Must be called when the sensor is completely still.
         */
        //% help=sensors/gyro/reset
        //% block="reset %sensor|"
        //% blockId=gyroReset  
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=50        
        //% group="Gyro Sensor"
        reset(): void {
            if (this.calibrating) return; // already in calibration mode

            this.calibrating = true;
            // may be triggered by a button click, 
            // give time for robot to settle
            pause(700);
            // send a reset command
            super.reset();
            // switch back to the desired mode
            this.setMode(this.mode);
            // wait till sensor is live
            pauseUntil(() => this.isActive());
            // give it a bit of time to init
            pause(1000)
            // compute drift
            this._drift = 0;
            if (this.mode == GyroSensorMode.Rate) {
                for (let i = 0; i < 200; ++i) {
                    this._drift += this._query();
                    pause(4);
                }
                this._drift /= 200;
            }
            // and we're done
            this.calibrating = false;
        }

        /**
         * Gets the computed rate drift
         */
        //%
        drift(): number {
            return this._drift;
        }

        /**
         * Enables or disable drift correction
         * @param enabled 
         */
        //%
        setDriftCorrection(enabled: boolean) {
            this._drifting = enabled;
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
