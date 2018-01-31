
namespace brick {
    /**
     * Returns the current battery level
     */
    //% blockId=brickBatteryLevel block="battery level"
    //% group="More"
    //% help=brick/battery-level
    export function batteryLevel(): number {
        const info = sensors.internal.getBatteryInfo();
        return info.current;
    }
}