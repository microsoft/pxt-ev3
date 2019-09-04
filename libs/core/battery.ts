
namespace brick {
    /**
     * Returns the current battery level
     */
    //% blockId=brickBatteryLevel block="battery level"
    //% group="Battery"
    //% help=brick/battery-level
    export function batteryLevel(): number {
        const info = sensors.internal.getBatteryInfo();
        return info.level;
    }

    /**
     * Returns the battery current
     */
    //% blockId=brickBatteryCurrent block="battery current"
    //% group="Battery"
    export function batteryCurrent(): number {
        const info = sensors.internal.getBatteryInfo();
        return info.Ibatt;
    }

    /**
     * Returns the battery voltage
     */
    //% blockId=brickBatteryVoltage block="battery voltage (V)"
    //% group="Battery"
    export function batteryVoltage(): number {
        const info = sensors.internal.getBatteryInfo();
        return info.Vbatt;
    }

    /**
     * Returns the motor current
     */
    //% blockId=brickMotorCurrent block="motor current"
    //% group="More"
    export function motorCurrent(): number {
        const info = sensors.internal.getBatteryInfo();
        return info.Imotor;
    }
}