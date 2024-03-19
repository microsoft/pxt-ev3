/// <reference path="../node_modules/pxt-core/localtypings/pxtblockly.d.ts"/>

import * as Blockly from "blockly";

const pxtblockly = pxt.blocks.requirePxtBlockly()
const BlocklyBlockly = pxt.blocks.requireBlockly();

export interface FieldColorEnumOptions {
    blocksInfo: any;
}

export class FieldColorEnum extends pxtblockly.FieldColorNumber {

    public isFieldCustom_ = true;
    private paramsData: any[];

    constructor(text: string, params: FieldColorEnumOptions, opt_validator?: Blockly.FieldValidator) {
        super(text, params, opt_validator);

        this.paramsData = params["data"];
    }

    mapColour(enumString: string) {
        switch(enumString) {
            case '#000000': return 'ColorSensorColor.Black';
            case '#006db3': return 'ColorSensorColor.Blue';
            case '#00934b': return 'ColorSensorColor.Green';
            case '#ffd01b': return 'ColorSensorColor.Yellow';
            case '#f12a21': return 'ColorSensorColor.Red';
            case '#ffffff': return 'ColorSensorColor.White';
            case '#6c2d00': return 'ColorSensorColor.Brown';
            default: return 'ColorSensorColor.None';
        }
    }

    mapEnum(colorString: string) {
        switch(colorString) {
            case 'ColorSensorColor.Black': return '#000000';
            case 'ColorSensorColor.Blue': return '#006db3';
            case 'ColorSensorColor.Green': return '#00934b';
            case 'ColorSensorColor.Yellow': return '#ffd01b';
            case 'ColorSensorColor.Red': return '#f12a21';
            case 'ColorSensorColor.White': return '#ffffff';
            case 'ColorSensorColor.Brown': return '#6c2d00';
            case 'ColorSensorColor.None': return '#dfe6e9';
            default: return colorString;
        }
    }

    showEditor_() {
        super.showEditor_();
        const colorCells = document.querySelectorAll('.legoColorPicker td');
        colorCells.forEach((cell) => {
            const titleName = this.mapColour(cell.getAttribute("title"));
            const index = this.paramsData.findIndex(item => item[1] === titleName);
            cell.setAttribute("title", this.paramsData[index][0]);
        });
    }

    /**
     * Return the current colour.
     * @param {boolean} opt_asHex optional field if the returned value should be a hex
     * @return {string} Current colour in '#rrggbb' format.
     */
    getValue(opt_asHex?: boolean) {
        const colour = this.mapColour(this.value_);
        if (!opt_asHex && colour.indexOf('#') > -1) {
            return `0x${colour.replace(/^#/, '')}`;
        }
        return colour;
    }

    /**
     * Set the colour.
     * @param {string} colour The new colour in '#rrggbb' format.
     */
    setValue(colorStr: string) {
        let colour = this.mapEnum(colorStr);
        if (this.sourceBlock_ && Blockly.Events.isEnabled() &&
            this.value_ != colour) {
            Blockly.Events.fire(new (Blockly as any).Events.BlockChange(
                this.sourceBlock_, 'field', this.name, this.value_, colour));
        }
        this.value_ = colour;
        if (this.sourceBlock_) {
            this.sourceBlock_.setColour(colour);
        }
    }
}