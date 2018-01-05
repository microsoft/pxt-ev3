namespace chassis {
    /**
     * A differential drive robot
     */
    export class Robot {
        // the motor pair
        public motors: motors.SynchedMotorPair;
        // the radius of the wheel (cm)
        public wheelRadius: number;
        // the distance between the wheels (cm)
        public baseLength: number;

        constructor() {
            this.motors = motors.largeBC;
            this.wheelRadius = 3;
            this.baseLength = 12;
        }

        /**
         * Makes a differential drive robot move with a given speed (cm/s) and rotation rate (deg/s)
         * using a unicycle model.
         * @param speed speed of the center point between motors, eg: 10
         * @param rotationSpeed rotation of the robot around the center point, eg: 30
         * @param value the amount of movement, eg: 2
         * @param unit 
         */
        //% blockId=motorDrive block="drive %chassis|at %speed|cm/s|turning %rotationSpeed|deg/s|for %value|%unit"
        //% inlineInputMode=inline
        //% group="Chassis"
        //% weight=8 blockGap=8
        drive(speed: number, rotationSpeed: number, value: number, unit: MoveUnit) {
            // speed is expressed in %
            const R = this.wheelRadius; // cm
            const L = this.baseLength; // cm
            const PI = 3.14;
            const maxw = 170 / 60 * 2 * PI; // rad / s
            const maxv = maxw * R; // cm / s
            // speed is cm / s
            const v = speed; // cm / s
            const w = rotationSpeed / 360 * 2 * PI; // rad / s

            const vr = (2 * v + w * L) / (2 * R); // rad / s
            const vl = (2 * v - w * L) / (2 * R); // rad / s

            const sr = vr / maxw * 100; // % 
            const sl = vl / maxw * 100; // %

            this.motors.tank(sr, sl, value, unit)
        }    
    }
}