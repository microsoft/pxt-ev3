
namespace brick {
    /**
     * Returns the current battery level
     */
    //% blockId=brickBatteryLevel block="battery level"
    //% group="More"
    //% help=brick/battery-level
    export function batteryLevel(): number {
        const info = sensors.internal.getBatteryInfo();
        return Math.round(info.CinCnt / 10);
    }

    /**
     * Returns the battery current
     */
    //% blockId=brickBatteryCurrent block="battery current"
    //% group="More"
    export function batteryCurrent(): number {
        const info = sensors.internal.getBatteryInfo();
        const CinV = info.CinCnt / 22
        return CinV / 0.11;
    }

    /**
     * Returns the battery voltage
     */
    //% blockId=brickBatteryVoltage block="battery voltage"
    //% group="More"
    export function batteryVoltage(): number {
        const info = sensors.internal.getBatteryInfo();
        const CinV = info.CinCnt / 22
        return (info.VinCnt / 0.5) + CinV + 0.05;
    }

    /**
     * Returns the motor current
     */
    //% blockId=brickMotorCurrent block="motor current"
    //% group="More"
    export function motorCurrent(): number {
        const info = sensors.internal.getBatteryInfo();
        const CoutV = info.CoutCnt / 19
        return CoutV / 0.055;
    }
}