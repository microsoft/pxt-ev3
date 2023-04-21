/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtblocks.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

export interface FieldMotorsOptions extends pxtblockly.FieldImagesOptions {
    columns?: string;
    width?: string;
}

export class FieldMotors extends pxtblockly.FieldImages implements Blockly.FieldCustom {
    public isFieldCustom_ = true;


    constructor(text: string, options: FieldMotorsOptions, validator?: Function) {
        super(text, options, validator);

        this.columns_ = parseInt(options.columns) || 4;
        this.width_ = parseInt(options.width) || 450;
        this.addLabel_ = true;

        this.renderSelectedImage_ = Blockly.FieldDropdown.prototype.renderSelectedText_;
        this.updateSize_ = (Blockly.Field as any).prototype.updateSize_;
    }

    trimOptions_() {
    }

    protected buttonClick_ = function (e: any) {
        let value = e.target.getAttribute('data-value');
        this.setValue(value);
        Blockly.DropDownDiv.hide();
    };
}