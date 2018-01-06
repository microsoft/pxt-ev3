/// <reference path="../node_modules/pxt-core/built/pxteditor.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

import { deployCoreAsync, initAsync } from "./deploy";
import { FieldPorts } from "./field_ports";
import { FieldImages } from "./field_images";

pxt.editor.initExtensionsAsync = function (opts: pxt.editor.ExtensionOptions): Promise<pxt.editor.ExtensionResult> {
    pxt.debug('loading pxt-ev3 target extensions...')
    updateBlocklyShape();
    const res: pxt.editor.ExtensionResult = {
        fieldEditors: [{
            selector: "ports",
            editor: FieldPorts
        }, {
            selector: "images",
            editor: FieldImages
        }],
        deployCoreAsync
    };
    initAsync().catch(e => {
        // probably no HID - we'll try this again upon deployment
    })
    return Promise.resolve<pxt.editor.ExtensionResult>(res);
}

/**
 * Update the shape of Blockly blocks with square corners
 */
function updateBlocklyShape() {

    /**
     * Rounded corner radius.
     * @const
     */
    (Blockly.BlockSvg as any).CORNER_RADIUS = 0 * (Blockly.BlockSvg as any).GRID_UNIT;

    /**
     * Inner space between edge of statement input and notch.
     * @const
     */
    (Blockly.BlockSvg as any).STATEMENT_INPUT_INNER_SPACE = 3 * (Blockly.BlockSvg as any).GRID_UNIT;
    /**
     * SVG path for drawing next/previous notch from left to right.
     * @const
     */
    (Blockly.BlockSvg as any).NOTCH_PATH_LEFT = (
        'l 8,8 ' +
        'h 16 ' +
        'l 8,-8 '
    );

    /**
     * SVG path for drawing next/previous notch from right to left.
     * @const
     */
    (Blockly.BlockSvg as any).NOTCH_PATH_RIGHT = (
        'l -8,8 ' +
        'h -16 ' +
        'l -8,-8 '
    );

    /**
     * SVG start point for drawing the top-left corner.
     * @const
     */
    (Blockly.BlockSvg as any).TOP_LEFT_CORNER_START =
        'm 0,' + 0;

    /**
     * SVG path for drawing the rounded top-left corner.
     * @const
     */
    (Blockly.BlockSvg as any).TOP_LEFT_CORNER =
        'l ' + (Blockly.BlockSvg as any).CORNER_RADIUS + ',0 ';

    /**
     * SVG path for drawing the rounded top-right corner.
     * @const
     */
    (Blockly.BlockSvg as any).TOP_RIGHT_CORNER =
        'l ' + 0 + ',' + (Blockly.BlockSvg as any).CORNER_RADIUS;

    /**
     * SVG path for drawing the rounded bottom-right corner.
     * @const
     */
    (Blockly.BlockSvg as any).BOTTOM_RIGHT_CORNER =
        'l 0,' + (Blockly.BlockSvg as any).CORNER_RADIUS;

    /**
     * SVG path for drawing the rounded bottom-left corner.
     * @const
     */
    (Blockly.BlockSvg as any).BOTTOM_LEFT_CORNER =
        'l -' + (Blockly.BlockSvg as any).CORNER_RADIUS + ',0';

    /**
     * SVG path for drawing the top-left corner of a statement input.
     * @const
     */
    (Blockly.BlockSvg as any).INNER_TOP_LEFT_CORNER =
        'l ' + (Blockly.BlockSvg as any).CORNER_RADIUS + ',-' + 0;

    /**
     * SVG path for drawing the bottom-left corner of a statement input.
     * Includes the rounded inside corner.
     * @const
     */
    (Blockly.BlockSvg as any).INNER_BOTTOM_LEFT_CORNER =
        'l ' + 0 + ',' + (Blockly.BlockSvg as any).CORNER_RADIUS * 2 +
        'l ' + (Blockly.BlockSvg as any).CORNER_RADIUS + ',' + 0;

    /**
     * Corner radius of the flyout background.
     * @type {number}
     * @const
     */
    (Blockly as any).Flyout.prototype.CORNER_RADIUS = 0;

    /**
     * Margin around the edges of the blocks in the flyout.
     * @type {number}
     * @const
     */
    (Blockly as any).Flyout.prototype.MARGIN = 8;

}

// When require()d from node, bind the global pxt namespace
// namespace pxt {
//     export const dummyExport = 1;
// }
// eval("if (typeof process === 'object' && process + '' === '[object process]') pxt = global.pxt")
