/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtblocks.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

export interface FieldPortsOptions extends pxtblockly.FieldImagesOptions {
    columns?: string;
    width?: string;
}

export class FieldPorts extends pxtblockly.FieldImages implements Blockly.FieldCustom {
    public isFieldCustom_ = true;

    constructor(text: string, options: FieldPortsOptions, validator?: Function) {
        super(text, { blocksInfo: options.blocksInfo, sort: true, data: options.data }, validator);

        this.columns_ = parseInt(options.columns) || 4;
        this.width_ = parseInt(options.width) || 300;

        this.setText = Blockly.FieldDropdown.prototype.setText;
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