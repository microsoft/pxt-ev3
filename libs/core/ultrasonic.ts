const enum UltrasonicSensorEvent {
    //% block="object near"
    ObjectNear = 1,
    //% block="object detected"
    ObjectDetected = 2
}

namespace sensors {

    //% fixedInstances
    export class UltraSonicSensor extends internal.UartSensor {
        private promixityThreshold: number;
        private movementThreshold: number;

        constructor(port: number) {
            super(port)
            this.promixityThreshold = 10;
            this.movementThreshold = 1;
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_ULTRASONIC
        }

        _query(): number {
            return this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff;            
        }

        _update(prev: number, curr: number) {
            // is there an object near?
            if (prev >= this.promixityThreshold && curr < this.promixityThreshold)
                control.raiseEvent(this._id, UltrasonicSensorEvent.ObjectNear); // TODO proper HI-LO sensor

            // did something change?
            if (Math.abs(prev - curr) > this.movementThreshold)
                control.raiseEvent(this._id, UltrasonicSensorEvent.ObjectDetected); // TODO debouncing
        }

        /**
         * Registers code to run when the given color is close
         * @param handler the code to run when detected
         */
        //% help=input/ultrasonic/on
        //% blockId=ultrasonicOn
        //% block="on `icons.ultrasonicSensor` %sensor|%event"
        //% parts="ultrasonicsensor"
        //% blockNamespace=sensors
        //% weight=100 blockGap=8
        //% group="Ultrasonic Sensor"
        on(event: UltrasonicSensorEvent, handler: () => void) {
            control.onEvent(this._id, event, handler);
            if (event == UltrasonicSensorEvent.ObjectNear 
                && this.distance() < this.promixityThreshold)
                control.runInBackground(handler);
        }

        /**
         * Waits for the event to occur
         */
        //% help=input/ultrasonic/wait
        //% block="wait `icons.ultrasonicSensor` %sensor|for %event"
        //% blockId=ultrasonicWait
        //% parts="ultrasonicsensor"
        //% blockNamespace=sensors
        //% weight=99 blockGap=8
        //% group="Ultrasonic Sensor"        
        wait(event: UltrasonicSensorEvent) {
            // TODO
        }

        /**
         * Gets the distance from the sonar in millimeters
         * @param sensor the ultrasonic sensor port
         */
        //% help=input/ultrasonic/distance
        //% block="`icons.ultrasonicSensor` %sensor|distance"
        //% blockId=sonarGetDistance
        //% parts="ultrasonicsensor"
        //% blockNamespace=sensors
        //% weight=65 blockGap=8   
        //% group="Ultrasonic Sensor"     
        distance() {
            // it supposedly also has an inch mode, but we stick to cm
            this._setMode(0)
            return this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff;
        }
    }
    
    //% fixedInstance whenUsed block="1"
    export const ultrasonic1: UltraSonicSensor = new UltraSonicSensor(1)
    
    //% fixedInstance whenUsed block="4"
    export const ultrasonic4: UltraSonicSensor = new UltraSonicSensor(4)

    //% fixedInstance whenUsed block="2"
    export const ultrasonic2: UltraSonicSensor = new UltraSonicSensor(2)

    //% fixedInstance whenUsed block="3"
    export const ultrasonic3: UltraSonicSensor = new UltraSonicSensor(3)
}
