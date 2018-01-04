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

        run() {
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
}
