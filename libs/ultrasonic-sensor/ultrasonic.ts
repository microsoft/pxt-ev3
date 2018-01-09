enum UltrasonicSensorEvent {
    //% block="object detected"
    ObjectDetected = 10,
    //% block="object near"
    ObjectNear = sensors.internal.ThresholdState.Low,
    //% block="object far"
    ObjectFar = sensors.internal.ThresholdState.High
}

namespace sensors {

    //% fixedInstances
    export class UltraSonicSensor extends internal.UartSensor {
        private promixityThreshold: sensors.internal.ThresholdDetector;
        private movementThreshold: number;

        constructor(port: number) {
            super(port)
            this.promixityThreshold = new sensors.internal.ThresholdDetector(this.id(), 0, 255, 10, 100); // range is 0..255cm
            this.movementThreshold = 1;
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_ULTRASONIC
        }

        _query(): number {
            return ((this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff) / 10) >> 0; // range is 0..2550, in 0.1 cm increments.
        }

        _update(prev: number, curr: number) {
            // is there an object near?
            this.promixityThreshold.setLevel(curr);

            // did something change?
            if (Math.abs(prev - curr) > this.movementThreshold)
                control.raiseEvent(this._id, UltrasonicSensorEvent.ObjectDetected);
        }

        /**
         * Registers code to run when the given color is close
         * @param handler the code to run when detected
         */
        //% help=input/ultrasonic/on
        //% blockId=ultrasonicOn
        //% block="on %sensor|%event"
        //% parts="ultrasonicsensor"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=100 blockGap=8
        //% group="Ultrasonic Sensor"
        onEvent(event: UltrasonicSensorEvent, handler: () => void) {
            control.onEvent(this._id, event, handler);
        }

        /**
         * Waits for the event to occur
         */
        //% help=input/ultrasonic/wait
        //% block="pause until %sensor| %event"
        //% blockId=ultrasonicWait
        //% parts="ultrasonicsensor"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=99 blockGap=8
        //% group="Ultrasonic Sensor"        
        pauseUntil(event: UltrasonicSensorEvent) {
            control.waitForEvent(this._id, event);
        }

        /**
         * Gets the distance from the sonar in centimeters
         * @param sensor the ultrasonic sensor port
         */
        //% help=input/ultrasonic/distance
        //% block="%sensor|distance"
        //% blockId=sonarGetDistance
        //% parts="ultrasonicsensor"
        //% blockNamespace=sensors
        //% sensor.fieldEditor="ports"
        //% weight=65
        //% group="Ultrasonic Sensor"     
        distance(): number {
            // it supposedly also has an inch mode, but we stick to cm
            this._setMode(0)
            return this._query();
        }


        /**
         * Sets a threshold value
         * @param condition the dark or bright light condition
         * @param value the value threshold
         */
        //% blockId=ultrasonicSetThreshold block="set %condition|to %value"
        //% group="Threshold"
        setThreshold(condition: UltrasonicSensorEvent, value: number) {            
            switch(condition) {
                case UltrasonicSensorEvent.ObjectNear: this.promixityThreshold.setLowThreshold(value); break;
                case UltrasonicSensorEvent.ObjectFar: this.promixityThreshold.setHighThreshold(value); break;
                case UltrasonicSensorEvent.ObjectDetected: this.movementThreshold = value; break;
            }
        }
    }
  
    //% fixedInstance whenUsed block="ultrasonic 4" jres=icons.port4
    export const ultrasonic4: UltraSonicSensor = new UltraSonicSensor(4)
    
    //% fixedInstance whenUsed block="ultrasonic 1" jres=icons.port1
    export const ultrasonic1: UltraSonicSensor = new UltraSonicSensor(1)

    //% fixedInstance whenUsed block="ultrasonic 2" jres=icons.port2
    export const ultrasonic2: UltraSonicSensor = new UltraSonicSensor(2)

    //% fixedInstance whenUsed block="ultrasonic 3" jres=icons.port3
    export const ultrasonic3: UltraSonicSensor = new UltraSonicSensor(3)
}
