namespace sensors {

    /**
     * A color enum picker
     * @param color to use, eg: ColorSensorColor.Blue
     */
    //% blockId=colorEnumPicker block="%color" shim=TD_ID
    //% weight=0 blockHidden=1
    //% color.fieldEditor="colorenum"
    //% color.fieldOptions.colours='["#f12a21", "#ffd01b", "#006db3", "#00934b", "#000000", "#6c2d00", "#ffffff", "#dfe6e9"]'
    //% color.fieldOptions.columns=2
    //% color.fieldOptions.className='legoColorPicker'
    export function __colorEnumPicker(color: ColorSensorColor): number {
        return color;
    }
}