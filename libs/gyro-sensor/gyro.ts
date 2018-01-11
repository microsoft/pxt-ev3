const enum GyroSensorMode {
    None = -1,
    Angle = 0,
    Rate = 1,
}

namespace sensors {
    namespace calibration {
        export const gyroDriftFactor = 0.005;
        export const gyroCalibrationSamples = 200;
    }

    //% fixedInstances
    export class GyroSensor extends internal.UartSensor {
        private _calibrating: boolean;
        private _rateOffset: number; // gyro is subject to drifting

        constructor(port: number) {
            super(port)
            this._calibrating = false;
            this._rateOffset = 0;
            this.setMode(GyroSensorMode.Rate);
        }

        _query(): number {
            return this.getNumber(NumberFormat.Int16LE, 0);
        }

        _update(prev: number, curr: number) {
            if (this.mode == GyroSensorMode.Rate) {
                // slow first order filter to counter drift
                this._rateOffset = calibration.gyroDriftFactor * curr + (1 - calibration.gyroDriftFactor) * this._rateOffset;
            } else {
                this._rateOffset = 0;
            }
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_GYRO
        }

        setMode(m: GyroSensorMode) {
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
            if (this._calibrating)
                pauseUntil(() => !this._calibrating, 2000);

            this.setMode(GyroSensorMode.Angle)
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
            if (this._calibrating)
                pauseUntil(() => !this._calibrating, 2000);

            this.setMode(GyroSensorMode.Rate)
            return this._query() - this._rateOffset;
        }

        /**
         * Gets the drift correction offset for the rate
         */
        //%
        rateOffset(): number {
            return this._rateOffset;
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
            if (this._calibrating) return; // already in calibration mode

            this._calibrating = true;
            // may be triggered by a button click, give time to settle
            loops.pause(500);
            // send a reset command
            this.reset();
            // we need to switch mode twice to perform a calibration
            if (this.mode == GyroSensorMode.Rate)
                this.setMode(GyroSensorMode.Angle);
            else
                this.setMode(GyroSensorMode.Rate);
            // switch back and wait
            if (this.mode == GyroSensorMode.Rate)
                this.setMode(GyroSensorMode.Angle);
            else
                this.setMode(GyroSensorMode.Rate);
            // give it more time to settle
            loops.pause(500);
            // compute offset for rate mode
            if (this.mode == GyroSensorMode.Rate) {
                let mx = 0;
                let mn = 0;
                let sum = 0;
                do {
                    // sample sensor and make sure it is standing still
                    mx = -1000;
                    mn = 1000;
                    sum = 0;
                    for (let i = 0; i < calibration.gyroCalibrationSamples; ++i) {
                        const v = this._query();
                        mx = Math.max(mx, v);
                        mn = Math.max(mn, v);
                        sum += v;
                        loops.pause(1);
                    }
                } while (mx - mn > 2);
                this._rateOffset = sum / calibration.gyroCalibrationSamples;
            }

            // unlock queries
            this._calibrating = false;
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
