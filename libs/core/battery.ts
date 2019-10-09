
const enum BatteryProperty {
    //% block="level (%)"
    Level,
    //% block="current (I)"
    Current,
    //% block="voltage (V)"
    Voltage
} 

namespace brick {
    /**
     * Returns the current battery level
     */
    //% blockId=brickBatteryLevel block="battery level"
    //% group="Battery"
    //% help=brick/battery-level
    //% deprecated blockHidden=1
    export function batteryLevel(): number {
        const info = sensors.internal.getBatteryInfo();
        return info.level;
    }

    /**
     * Returns information about the battery
     */
    //% blockId=brickBatteryProperty block="battery %property"
    //% group="Power"
    //% blockGap=8
    //% help=brick/battery-property
    export function batteryInfo(property: BatteryProperty): number {
        const info = sensors.internal.getBatteryInfo();
        switch(property) {
            case BatteryProperty.Level: return info.level;
            case BatteryProperty.Current: return info.Ibatt;
            case BatteryProperty.Voltage: return info.Vbatt;
            default: return 0;
        }

    }
}