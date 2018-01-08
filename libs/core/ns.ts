
namespace motors {

    /**
     * A speed picker
     * @param speed the speed, eg: 50
     */
    //% blockId=motorSpeedPicker block="%speed" shim=TD_ID
    //% speed.fieldEditor="speed" colorSecondary="#FFFFFF"
    //% weight=0 blockHidden=1 speed.fieldOptions.decompileLiterals=1
    export function __speedPicker(speed: number): number {
        return speed;
    }

    /**
     * A unit value picker
     * @param unitValue the unit value, eg: 2
     */
    //% blockId=motorUnitValuePicker block="%unitValue" shim=TD_ID
    //% unitValue.fieldEditor="unitvalue" colorSecondary="#FFFFFF"
    //% weight=0 blockHidden=1 unitValue.fieldOptions.decompileLiterals=1
    export function __unitValuePicker(unitValue: number): number {
        return unitValue;
    }
}