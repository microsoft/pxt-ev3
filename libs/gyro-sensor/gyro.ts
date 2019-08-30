const enum GyroSensorMode {
    None = 0,
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
            this._drifting = false;
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
        //% block="**gyro** %this|angle"
        //% blockId=gyroGetAngle
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
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
        //% block="**gyro** %this|rate"
        //% blockId=gyroGetRate
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=65 blockGap=8
        //% group="Gyro Sensor"
        rate(): number {
            if (this.calibrating)
                pauseUntil(() => !this.calibrating, 2000);

            this.setMode(GyroSensorMode.Rate);
            let curr = this._query();
            if (Math.abs(curr) < 16 && this._drifting) {
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
        //% block="reset **gyro** %this|"
        //% blockId=gyroReset
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=50
        //% group="Gyro Sensor"
        reset(): void {
            if (this.calibrating) return; // already in calibration mode

            const statusLight = brick.statusLight(); // save current status light
            brick.setStatusLight(StatusLight.Orange);

            this.calibrating = true;
            // may be triggered by a button click,
            // give time for robot to settle
            pause(700);

            // calibrating
            brick.setStatusLight(StatusLight.OrangePulse);

            // send a reset command
            super.reset();
            // switch back to the desired mode
            this.setMode(this.mode);
            // wait till sensor is live
            pauseUntil(() => this.isActive(), 5000);

            // check sensor is ready
            if (!this.isActive()) {
                brick.setStatusLight(StatusLight.RedFlash); // didn't work
                pause(2000);
                brick.setStatusLight(statusLight); // restore previous light
                return;
            }

            // compute drift
            this._drift = 0;
            if (this.mode == GyroSensorMode.Rate) {
                const n = 100;
                for (let i = 0; i < n; ++i) {
                    this._drift += this._query();
                    pause(4);
                }
                this._drift /= n;
            }

            brick.setStatusLight(StatusLight.Green); // success
            pause(500);
            brick.setStatusLight(statusLight); // resture previous light

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
            this._drift = 0;
        }
    }

    //% fixedInstance whenUsed block="2" weight=95 jres=icons.port2
    export const gyro2: GyroSensor = new GyroSensor(2)

    //% fixedInstance whenUsed block="1" jres=icons.port1
    export const gyro1: GyroSensor = new GyroSensor(1)

    //% fixedInstance whenUsed block="3" jres=icons.port3
    export const gyro3: GyroSensor = new GyroSensor(3)

    //% fixedInstance whenUsed block="4" jres=icons.port4
    export const gyro4: GyroSensor = new GyroSensor(4)
}
