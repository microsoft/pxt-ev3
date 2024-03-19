/// <reference path="../node_modules/pxt-core/localtypings/pxtblockly.d.ts"/>

const pxtblockly = pxt.blocks.requirePxtBlockly()
const Blockly = pxt.blocks.requireBlockly();

export interface FieldPortsOptions {
    columns?: string;
    width?: string;
}

export class FieldPorts extends pxtblockly.FieldImages {
    public isFieldCustom_ = true;

    constructor(text: string, options: FieldPortsOptions, validator?: Function) {
        super(text, options as any, validator);

        this.columns_ = parseInt(options.columns) || 4;
        this.width_ = parseInt(options.width) || 300;

        //this.setText = Blockly.FieldDropdown.prototype.setText;
        this.updateSize_ = (Blockly.Field as any).prototype.updateSize_;
    }
    
}