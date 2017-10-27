const enum PromixityEvent {
    //% block="object near"
    ObjectNear = 1,
    //% block="object detected"
    ObjectDetected = 2
}

namespace input {

    //% fixedInstances
    export class UltraSonicSensor extends internal.UartSensor {
        private promixityThreshold: number;

        constructor(port: number) {
            super(port)
            this.promixityThreshold = 10;
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_ULTRASONIC
        }

        _query(): number {
            const d = this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff;            
            return d < this.promixityThreshold ? PromixityEvent.ObjectNear
                : d > this.promixityThreshold + 5 ? PromixityEvent.ObjectDetected
                : 0;
        }

        _update(prev: number, curr: number) {
            if (curr) 
                control.raiseEvent(this._id, curr);
        }

        /**
         * Registers code to run when the given color is close
         * @param handler the code to run when detected
         */
        //% help=input/ultrasonic/on-object-near
        //% block="on %sensor|object near"
        //% blockId=ultrasonicOnObjectClose
        //% parts="infraredsensor"
        //% blockNamespace=input
        //% weight=100 blockGap=8
        //% group="Ultrasonic Sensor"
        onObjectNear(handler: () => void) {
            control.onEvent(this._id, PromixityEvent.ObjectNear, handler);
            if (this.distance() == PromixityEvent.ObjectNear)
                control.runInBackground(handler);
        }

        setObjectNearThreshold(distance: number) {
            this.promixityThreshold = Math.max(1, Math.min(250, distance));
        }

        /**
         * Gets the distance from the sonar in millimeters
         * @param sensor the ultrasonic sensor port
         */
        //% help=input/ultrasonic/distance
        //% block="%sensor|distance"
        //% blockId=sonarGetDistance
        //% parts="ultrasonic"
        //% blockNamespace=input
        //% weight=65 blockGap=8   
        //% group="Ultrasonic Sensor"     
        distance() {
            // it supposedly also has an inch mode, but we stick to mm
            this._setMode(0)
            return this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff;
        }
    }

    //% fixedInstance whenUsed block="ultrasonic sensor 4"
    export const ultrasonic4: UltraSonicSensor = new UltraSonicSensor(4)
    
    //% fixedInstance whenUsed block="ultrasonic sensor 1"
    export const ultrasonic1: UltraSonicSensor = new UltraSonicSensor(1)

    //% fixedInstance whenUsed block="ultrasonic sensor 2"
    export const ultrasonic2: UltraSonicSensor = new UltraSonicSensor(2)

    //% fixedInstance whenUsed block="ultrasonic sensor 3"
    export const ultrasonic3: UltraSonicSensor = new UltraSonicSensor(3)
}
