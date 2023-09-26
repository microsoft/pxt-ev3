enum UltrasonicSensorEvent {
    //% block="object detected"
    ObjectDetected = 10,
    //% block="object near"
    ObjectNear = sensors.ThresholdState.Low
}

namespace sensors {

    //% fixedInstances
    export class UltraSonicSensor extends internal.UartSensor {
        private promixityThreshold: sensors.ThresholdDetector;
        private movementThreshold: number;

        constructor(port: number) {
            super(port)
            this.promixityThreshold = new sensors.ThresholdDetector(this.id(), 0, 255, 10, 100); // range is 0..255cm
            this.movementThreshold = 1;
            this._setMode(0);
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_ULTRASONIC
        }

        _query() {
            return [((this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff) / 10) >> 0]; // range is 0..2550, in 0.1 cm increments.
        }

        _info() {
            return [`${this.distance()}cm`];
        }

        _update(prev: number, curr: number) {
            // is there an object near?
            this.promixityThreshold.setLevel(curr);

            // did something change?
            if (Math.abs(prev - curr) > this.movementThreshold)
                control.raiseEvent(this._id, UltrasonicSensorEvent.ObjectDetected);
        }

        /**
         * Registers code to run when an object is close or detected
         * @param handler the code to run when detected
         */
        //% help=sensors/ultrasonic/on-event
        //% blockId=ultrasonicOn
        //% block="on **ultrasonic** %this|%event"
        //% parts="ultrasonicsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=100 blockGap=8
        //% group="Ultrasonic Sensor"
        onEvent(event: UltrasonicSensorEvent, handler: () => void) {
            control.onEvent(this._id, event, handler);
        }

        /**
         * Waits for the event to occur
         */
        //% help=sensors/ultrasonic/pause-until
        //% block="pause until **ultrasonic** %this| %event"
        //% blockId=ultrasonicWait
        //% parts="ultrasonicsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=99 blockGap=8
        //% group="Ultrasonic Sensor"
        pauseUntil(event: UltrasonicSensorEvent) {
            control.waitForEvent(this._id, event);
        }

        /**
         * Gets the distance from the sonar in centimeters
         * @param sensor the ultrasonic sensor port
         */
        //% help=sensors/ultrasonic/distance
        //% block="**ultrasonic** %this|distance"
        //% blockId=sonarGetDistance
        //% parts="ultrasonicsensor"
        //% blockNamespace=sensors
        //% this.fieldEditor="ports"
        //% weight=65
        //% group="Ultrasonic Sensor"
        distance(): number {
            this.poke();
            // it supposedly also has an inch mode, but we stick to cm
            this._setMode(0)
            return this._query()[0];
        }


        /**
         * Sets a threshold value
         * @param condition the near or detected condition
         * @param value the value threshold
         */
        //% blockId=ultrasonicSetThreshold block="set **ultrasonic** %this|%condition|to %value"
        //% group="Calibration" blockGap=8 weight=80
        //% value.min=0 value.max=255
        //% this.fieldEditor="ports"
        setThreshold(condition: UltrasonicSensorEvent, value: number) {
            switch (condition) {
                case UltrasonicSensorEvent.ObjectNear: this.promixityThreshold.setLowThreshold(value); break;
                case UltrasonicSensorEvent.ObjectDetected: this.movementThreshold = value; break;
            }
        }

        /**
         * Gets the threshold value
         * @param condition the proximity condition
         */
        //% blockId=ultrasonicGetThreshold block="**ultrasonic** %this|%condition"
        //% group="Calibration" weight=79
        //% this.fieldEditor="ports"
        threshold(condition: UltrasonicSensorEvent): number {
            switch (condition) {
                case UltrasonicSensorEvent.ObjectNear: return this.promixityThreshold.threshold(ThresholdState.Low);
                case UltrasonicSensorEvent.ObjectDetected: return this.movementThreshold;
            }
            return 0;
        }
    }

    //% fixedInstance whenUsed block="4" jres=icons.port4
    export const ultrasonic4: UltraSonicSensor = new UltraSonicSensor(4)

    //% fixedInstance whenUsed block="1" jres=icons.port1
    export const ultrasonic1: UltraSonicSensor = new UltraSonicSensor(1)

    //% fixedInstance whenUsed block="2" jres=icons.port2
    export const ultrasonic2: UltraSonicSensor = new UltraSonicSensor(2)

    //% fixedInstance whenUsed block="3" jres=icons.port3
    export const ultrasonic3: UltraSonicSensor = new UltraSonicSensor(3)
}
