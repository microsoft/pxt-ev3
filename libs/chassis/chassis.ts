/**
 * A differential drive robot
 */
//% weight=50 color=#cf00cf
namespace chassis {
    /**
     * A differential drive robot
     */
    //% fixedInstances
    export class Chassis {
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
         * @param distance
         **/
        //% blockId=motorDrive block="drive %chassis|at %speed|cm/s|turning %rotationSpeed|deg/s"
        //% inlineInputMode=inline
        //% weight=95 blockGap=8
        drive(speed: number, rotationSpeed: number, distance: number = 0) {
            if (!speed) {
                this.motors.stop();
                return;
            } 

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

            // cm / (cm/s) = s
            const seconds = distance / speed;

            this.motors.tank(sr, sl, seconds, MoveUnit.Seconds)
        }

        /**
         * Sets the wheel radius in centimeters
         * @param cm 
         */
        //% blockId=chassisSetWheelRadius block="set %chassis|wheel radius to %cm|(cm)"
        setWheelRadius(cm: number) {
            this.wheelRadius = cm;
        }

        /**
         * Sets the base length in centimeters
         * @param cm 
         */
        //% blockId=chassisSetBaseLength block="set %chassis|base length to %cm|(cm)"
        setBaseLength(cm: number) {
            this.baseLength = cm;
        }
        
        /**
         * Sets the motors used by the chassis, default is B+C
         * @param motors 
         */
        //% blockId=chassisSetMotors block="set %chassis|motors to %motors"
        //% weight=10
        setMotors(motors: motors.SynchedMotorPair) {
            this.motors = motors;
        }

        toString(): string {
            return `chassis base ${this.baseLength}, wheel ${this.wheelRadius}`;
        }
    }

    //% fixedInstance whenUsed
    export const chassis = new Chassis();
}