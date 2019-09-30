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
        //% weight=64
        //% group="Gyro Sensor"
        angle(): number {
            this.poke();
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
            this.poke();
            if (this.calibrating)
                pauseUntil(() => !this.calibrating, 2000);

            this.setMode(GyroSensorMode.Rate);
            return this._query() - this._drift;
        }

        /**
         * Forces a calibration of the with light progress indicators. 
         * Must be called when the sensor is completely still.
         */
        //% help=sensors/gyro/calibrate
        //% block="calibrate **gyro** %this|"
        //% blockId=gyroCalibrate
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=51 blockGap=8
        //% group="Gyro Sensor"
        calibrate(): void {
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
            // wait till sensor is live
            pauseUntil(() => this.isActive(), 7000);
            // mode toggling
            this.setMode(GyroSensorMode.Rate);
            this.setMode(GyroSensorMode.Angle);

            // check sensor is ready
            if (!this.isActive()) {
                brick.setStatusLight(StatusLight.RedFlash); // didn't work
                pause(2000);
                brick.setStatusLight(statusLight); // restore previous light
                this.calibrating = false;
                return;
            }

            // switch to rate mode
            this.computeDriftNoCalibration();
            // switch back to the desired mode
            this.setMode(this.mode);

            // and done
            brick.setStatusLight(StatusLight.Green); // success
            pause(1000);
            brick.setStatusLight(statusLight); // resture previous light

            // and we're done
            this.calibrating = false;
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
        //% weight=50 blockGap=8
        //% group="Gyro Sensor"
        reset(): void {
            if (this.calibrating) return; // already in calibration mode

            this.calibrating = true;
            // send a reset command
            super.reset();
            // and done
            this.calibrating = false;
        }

        /**
         * Gets the computed rate drift
         */
        //% help=sensors/gyro/drift
        //% block="**gyro** %this|drift"
        //% blockId=gyroDrift
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=9 blockGap=8
        //% group="Gyro Sensor"
        drift(): number {
            return this._drift;
        }

        /**
         * Computes the current sensor drift when using rate measurements.
         */
        //% help=sensors/gyro/compute-drift
        //% block="compute **gyro** %this|drift"
        //% blockId=gyroComputeDrift
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=10 blockGap=8
        //% group="Gyro Sensor"
        computeDrift() {
            if (this.calibrating)
                pauseUntil(() => !this.calibrating, 2000);
            pause(1000); // let the robot settle
            this.computeDriftNoCalibration();
        }

        private computeDriftNoCalibration() {
            // clear drift
            this.setMode(GyroSensorMode.Rate);
            this._drift = 0;
            const n = 100;
            let d = 0;
            for (let i = 0; i < n; ++i) {
                d += this._query();
                pause(4);
            }
            this._drift = Math.round(d / n);
        }

        _info(): string {
            if (this.calibrating)
                return "cal...";

            switch (this.mode) {
                case GyroSensorMode.Angle:
                    return `${this._query()}>`;
                case GyroSensorMode.Rate:
                    let r = `${this._query()}r`;
                    if (this._drift != 0)
                        r += `-${this._drift | 0}`;
                    return r;
            }
            return "";
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
