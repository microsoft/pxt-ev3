/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

export interface FieldColorEnumOptions extends pxtblockly.FieldColourNumberOptions {
}

export class FieldColorEnum extends pxtblockly.FieldColorNumber implements Blockly.FieldCustom {
    public isFieldCustom_ = true;

    constructor(text: string, params: FieldColorEnumOptions, opt_validator?: Function) {
        super(text, params, opt_validator);
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
            case 'ColorSensorColor.None': return '#dfe6e9'; // Grey
            default: return colorString;
        }
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