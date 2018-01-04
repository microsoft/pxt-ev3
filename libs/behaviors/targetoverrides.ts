namespace behaviors {
    class AvoidCrashBehavior extends behaviors.Behavior {
        private ultrasonic: sensors.UltraSonicSensor;
        constructor(ultrasonic: sensors.UltraSonicSensor) {
            super();
            this.ultrasonic = ultrasonic;
        }

        shouldRun(): boolean {
            return this.ultrasonic.distance() < 5;
        }

        run(): void {
            motors.stopAllMotors();
            this.active = false;
        }
    }

    /**
     * A behavior that stops all motors if the sensor distance get too short
     */
    //% blockId=behaviorsAvoidCrash block="avoid crash using %ultrasonic"
    export function avoidCrash(ultrasonic: sensors.UltraSonicSensor) : behaviors.Behavior {
        return new AvoidCrashBehavior(ultrasonic);
    }

    class DriveForwardBehavior extends behaviors.Behavior {
        private motors: motors.MotorBase;
        private speed: number;
        constructor(motors: motors.MotorBase, speed: number) {
            super();
            this.motors = motors;
            this.speed = speed;
        }

        shouldRun(): boolean { 
            return true;
        }

        run(): void {
            this.motors.setSpeed(this.speed);
            pauseUntil(() => !this.active);
            this.motors.setSpeed(0);
        }
    }

    /**
     * A behavior that turns on the motors to the specified speed
     * @param motors 
     * @param speed the desired speed, eg: 50
     */
    //% blockId=behaviorsDriveForward block="drive %motors|forward at %speed|%"
    export function driveForward(motors: motors.MotorBase, speed: number): behaviors.Behavior {
        return new DriveForwardBehavior(motors, speed);
    }
}
