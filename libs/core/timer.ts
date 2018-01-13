namespace control {
    //% fixedInstances
    export class Timer {
        start: number;

        constructor() {
            this.start = control.millis();
        }

        /**
         * Gets the elapsed time in millis
         */
        //% blockId=timerMillis block="%timer|millis"
        millis(): number {
            return control.millis() - this.start;
        }
        
        /**
         * Gets the elapsed time in seconds
         */
        //% blockId=timerSeconds block="%timer|seconds"
        seconds(): number {
            return this.millis() / 1000;
        }

        /**
         * Resets the timer
         */
        //% blockId=timerRest block="%timer|reset"
        reset() {
            this.start = control.millis();
        }
    }

    //% whenUsed fixedInstance block="timer 1"
    export const timer1 = new Timer();
    //% whenUsed fixedInstance block="timer 2"
    export const timer2 = new Timer();
    //% whenUsed fixedInstance block="timer 3"
    export const timer3 = new Timer();
    //% whenUsed fixedInstance block="timer 4"
    export const timer4 = new Timer();
    //% whenUsed fixedInstance block="timer 5"
    export const timer5 = new Timer();
    //% whenUsed fixedInstance block="timer 6"
    export const timer6 = new Timer();
    //% whenUsed fixedInstance block="timer 7"
    export const timer7 = new Timer();
    //% whenUsed fixedInstance block="timer 8"
    export const timer8 = new Timer();
}