const enum GyroSensorMode {
    None = 0,
    Angle = 0, // Rotation angle
    Rate = 1, // Rotational speed
    GnA = 2, // Angle and rotational speed
    Fas = 3, // Raw sensor value
    Cal = 4, // Calibration
    TiltRate = 5, // Tilt speed
    TiltAngle = 6 // Tilt angle
}

const enum GyroGetMethodValues {
    RateEulerIntegrator = 0,
    DeflVersion = 1
}

namespace sensors {

    //% fixedInstances
    export class GyroSensor extends internal.UartSensor {

        private _calibrating: boolean;
        private _rotationDrift: number;
        private _tiltDrift: number;
        private _rotationAngle: control.EulerIntegrator;
        private _tiltAngle: control.EulerIntegrator;

        constructor(port: number) {
            super(port)
            this._calibrating = false;
            this._rotationDrift = 0;
            this._tiltDrift = 0;
            this._rotationAngle = new control.EulerIntegrator();
            this._tiltAngle = new control.EulerIntegrator();
            this.setMode(GyroSensorMode.Rate);
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_GYRO;
        }

        _query() {
            if (this.mode == GyroSensorMode.Rate) { // this.mode == GyroSensorMode.Angle || this.mode == GyroSensorMode.Rate
                const v = this.getNumber(NumberFormat.Int16LE, 0);
                this._rotationAngle.integrate(v - this._rotationDrift);
                return [v];
            } else if (this.mode == GyroSensorMode.Angle || this.mode == GyroSensorMode.TiltAngle) {
                return [this.getNumber(NumberFormat.Int16LE, 0)];
            } else if (this.mode == GyroSensorMode.TiltRate) {
                const v = this.getNumber(NumberFormat.Int16LE, 0);
                this._tiltAngle.integrate(v - this._tiltDrift);
                return [v];
            }
            return [0];
        }

        setMode(m: GyroSensorMode) {
            this._setMode(m);
        }

        isCalibrating(): boolean {
            return this._calibrating;
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
        //% weight=100 blockGap=8
        //% group="Gyro Sensor"
        //% deprecated=true
        angle(): number {
            this.setMode(GyroSensorMode.Rate);
            this.poke();
            if (this._calibrating) {
                pauseUntil(() => !this._calibrating, 2000);
            }
            return Math.round(this._rotationAngle.value);
        }

        /**
         * Get the current rotate angle from the gyroscope.
         * @param sensor the gyroscope to query the request
         */
        //% help=sensors/gyro/rotate-angle
        //% block="**gyro** %this|rotate angle"
        //% blockId=gyroGetRotateAngle
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=100 blockGap=8
        //% group="Gyro Sensor"
        rotationAngle(method: GyroGetMethodValues = GyroGetMethodValues.RateEulerIntegrator): number {
            if (method == GyroGetMethodValues.RateEulerIntegrator) return this.angle();
            else if (method == GyroGetMethodValues.DeflVersion) {
                this.setMode(GyroSensorMode.Angle);
                this.poke();
                if (this._calibrating) {
                    pauseUntil(() => !this._calibrating, 2000);
                }
                return this._query()[0];
            }
            return 0;
        }

        /**
         * Get the current tilt angle from the gyroscope.
         * @param sensor the gyroscope to query the request
         */
        //% help=sensors/gyro/tilt-angle
        //% block="**gyro** %this|tilt angle"
        //% blockId=gyroGetTiltAngle
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=99 blockGap=8
        //% group="Gyro Sensor"
        tiltAngle(method: GyroGetMethodValues = GyroGetMethodValues.RateEulerIntegrator): number {
            if (method == GyroGetMethodValues.RateEulerIntegrator) {
                this.setMode(GyroSensorMode.TiltRate);
                this.poke();
                if (this._calibrating) {
                    pauseUntil(() => !this._calibrating, 2000);
                }
                return Math.round(this._tiltAngle.value);
            } else if (method == GyroGetMethodValues.DeflVersion) {
                this.setMode(GyroSensorMode.TiltAngle);
                this.poke();
                if (this._calibrating) {
                    pauseUntil(() => !this._calibrating, 2000);
                }
                return this._query()[0];
            }
            return 0;
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
        //% weight=99 blockGap=8
        //% group="Gyro Sensor"
        //% deprecated=true
        rate(): number {
            this.setMode(GyroSensorMode.Rate);
            this.poke();
            if (this._calibrating) {
                pauseUntil(() => !this._calibrating, 2000);
            }
            return this._query()[0] - this._rotationDrift;
        }

        /**
         * Get the current rotation rate from the gyroscope.
         * @param sensor the gyroscope to query the request
         */
        //% help=sensors/gyro/rotation-rate
        //% block="**gyro** %this|rotation rate"
        //% blockId=gyroGetRotationRate
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=99 blockGap=8
        //% group="Gyro Sensor"
        rotationRate(): number {
            return this.rate();
        }

        /**
         * Get the current tilt rate from the gyroscope.
         * @param sensor the gyroscope to query the request
         */
        //% help=sensors/gyro/tilt-rate
        //% block="**gyro** %this|tilt rate"
        //% blockId=gyroGetTiltRate
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=98 blockGap=8
        //% group="Gyro Sensor"
        tiltRate(): number {
            this.setMode(GyroSensorMode.TiltRate);
            this.poke();
            if (this._calibrating) {
                pauseUntil(() => !this._calibrating, 2000);
            }
            return this._query()[0] - this._tiltDrift;
        }

        /**
         * Detects if calibration is necessary and performs a full reset, drift computation.
         * Must be called when the sensor is completely still.
         */
        //% help=sensors/gyro/calibrate
        //% block="calibrate **gyro** %this|"
        //% blockId=gyroCalibrate
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=89 blockGap=8
        //% group="Gyro Sensor"
        calibrate(): void {
            if (this._calibrating) return; // already in calibration mode

            const statusLight = brick.statusLight(); // save current status light
            brick.setStatusLight(StatusLight.Orange);

            this._calibrating = true;
            // may be triggered by a button click,
            // give time for robot to settle
            pause(700);

            // compute drift
            //this.computeTiltDriftNoCalibration();
            this.computeRotationDriftNoCalibration();
            if (Math.abs(this.rotationDrift()) < 0.1) {
                // no drift, skipping calibration
                brick.setStatusLight(StatusLight.Green); // success
                pause(1000);
                brick.setStatusLight(statusLight); // resture previous light

                // and we're done
                this._rotationAngle.reset();
                this._tiltAngle.reset();
                this._calibrating = false;
                return;
            }

            // calibrating
            brick.setStatusLight(StatusLight.OrangePulse);

            // send a reset command
            super.reset();
            // wait till sensor is live
            pauseUntil(() => this.isActive(), 7000);
            // mode toggling
            this.setMode(GyroSensorMode.Rate);
            this.setMode(GyroSensorMode.Angle);
            this.setMode(GyroSensorMode.Rate);

            // check sensor is ready
            if (!this.isActive()) {
                brick.setStatusLight(StatusLight.RedFlash); // didn't work
                pause(2000);
                brick.setStatusLight(statusLight); // restore previous light
                this._rotationAngle.reset();
                this._tiltAngle.reset();
                this._calibrating = false;
                return;
            }

            //this.computeTiltDriftNoCalibration();
            this.computeRotationDriftNoCalibration(); // switch to rate mode

            // and done
            brick.setStatusLight(StatusLight.Green); // success
            pause(1000);
            brick.setStatusLight(statusLight); // resture previous light

            // and we're done
            this._rotationAngle.reset();
            this._tiltAngle.reset();
            this._calibrating = false;
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
        //% weight=88
        //% group="Gyro Sensor"
        reset(): void {
            if (this._calibrating) return; // already in calibration mode

            this._calibrating = true;
            const statusLight = brick.statusLight(); // save current status light
            brick.setStatusLight(StatusLight.Orange);

            // send a reset command
            super.reset();
            this._rotationDrift = 0;
            this._tiltDrift = 0;
            this._rotationAngle.reset();
            this._tiltAngle.reset();
            pauseUntil(() => this.isActive(), 7000);

            // check sensor is ready
            if (!this.isActive()) {
                brick.setStatusLight(StatusLight.RedFlash); // didn't work
                pause(2000);
                brick.setStatusLight(statusLight); // restore previous light
                this._rotationAngle.reset();
                this._tiltAngle.reset();
                this._calibrating = false;
                return;
            }

            this.setMode(GyroSensorMode.Rate);

            // and done
            brick.setStatusLight(StatusLight.Green); // success
            pause(1000);
            brick.setStatusLight(statusLight); // resture previous light
            // and done
            this._rotationAngle.reset();
            this._tiltAngle.reset();
            this._calibrating = false;
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
        //% weight=78 blockGap=8
        //% group="Gyro Sensor"
        //% deprecated=true
        drift(): number {
            return this._rotationDrift;
        }

        /**
         * Gets the computed rotation rate drift.
         */
        //% help=sensors/gyro/rotation-drift
        //% block="**gyro** %this|rotation drift"
        //% blockId=gyroRotationDrift
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=78 blockGap=8
        //% group="Gyro Sensor"
        rotationDrift(): number {
            return this._rotationDrift;
        }

        /**
         * Gets the computed tilt rate drift.
         */
        //% help=sensors/gyro/tilt-drift
        //% block="**gyro** %this|tilt drift"
        //% blockId=gyroTiltDrift
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=78 blockGap=8
        //% group="Gyro Sensor"
        tiltDrift(): number {
            return this._tiltDrift;
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
        //% weight=79 blockGap=8
        //% group="Gyro Sensor"
        //% deprecated=true
        computeDrift() {
            if (this._calibrating)
                pauseUntil(() => !this._calibrating, 2000);
            pause(1000); // let the robot settle
            this.computeRotationDriftNoCalibration();
        }

        /**
         * Computes the current sensor rotation drift when using rate measurements.
         */
        //% help=sensors/gyro/compute-rotation-drift
        //% block="compute **gyro** %this|rotation drift"
        //% blockId=gyroComputeRotationDrift
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=79 blockGap=8
        //% group="Gyro Sensor"
        computeRotationDrift() {
            if (this._calibrating)
                pauseUntil(() => !this._calibrating, 2000);
            pause(1000); // let the robot settle
            this.computeRotationDriftNoCalibration();
        }

        /**
         * Computes the current sensor tilt drift when using rate measurements.
         */
        //% help=sensors/gyro/compute-tilt-drift
        //% block="compute **gyro** %this|tilt drift"
        //% blockId=gyroComputeTiltDrift
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=79 blockGap=8
        //% group="Gyro Sensor"
        computeTiltDrift() {
            if (this._calibrating)
                pauseUntil(() => !this._calibrating, 2000);
            pause(1000); // let the robot settle
            this.computeTiltDriftNoCalibration();
        }

        /**
         * Pauses the program until the gyro detected
         * that the angle changed by the desired amount of degrees.
         * @param degrees the degrees to turn
         */
        //% help=sensors/gyro/pause-until-rotated
        //% block="pause until **gyro** %this|rotated %degrees=rotationPicker|degrees"
        //% blockId=gyroPauseUntilRotated
        //% parts="gyroscope"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% degrees.defl=90
        //% weight=98
        //% group="Gyro Sensor"
        pauseUntilRotated(degrees: number, timeOut?: number): void {
            let a = this.angle();
            const end = a + degrees;
            const direction = (end - a) > 0 ? 1 : -1;
            pauseUntil(() => (end - this.angle()) * direction <= 0, timeOut);
        }

        private computeRotationDriftNoCalibration() {
            // clear rotation drift
            this._rotationDrift = 0;
            const n = 10;
            let d = 0;
            for (let i = 0; i < n; ++i) {
                d += this._query()[0];
                pause(20);
            }
            this._rotationDrift = d / n;
            this._rotationAngle.reset();
        }

        private computeTiltDriftNoCalibration() {
            // clear tilt drift
            this._tiltDrift = 0;
            const n = 10;
            let d = 0;
            for (let i = 0; i < n; ++i) {
                d += this._query()[0];
                pause(20);
            }
            this._tiltDrift = d / n;
            this._tiltAngle.reset();
        }

        _info() {
            if (this._calibrating) {
                return ["cal..."];
            }

            if (this.mode == GyroSensorMode.Rate || this.mode == GyroSensorMode.Angle) {
                let r = `${this._query()[0]}r`;
                if (this._rotationDrift != 0) {
                    r += `-${this._rotationDrift | 0}`;
                }
                return [r];
            } else if (this.mode == GyroSensorMode.TiltRate || this.mode == GyroSensorMode.TiltAngle) {
                let r = `${this._query()[0]}r`;
                if (this._tiltDrift != 0) {
                    r += `-${this._tiltDrift | 0}`;
                }
                return [r];
            }
            return [`0`];
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

    /**
      * Get the rotation angle field editor
      * @param degrees angle in degrees, eg: 90
      */
    //% blockId=rotationPicker block="%degrees"
    //% blockHidden=true shim=TD_ID
    //% colorSecondary="#FFFFFF"
    //% degrees.fieldEditor="numberdropdown" degrees.fieldOptions.decompileLiterals=true
    //% degrees.fieldOptions.data='[["30", 30], ["45", 45], ["60", 60], ["90", 90], ["180", 180], ["-30", -30], ["-45", -45], ["-60", -60], ["-90", -90], ["-180", -180]]'
    export function __rotationPicker(degrees: number): number {
        return degrees;
    }
}
