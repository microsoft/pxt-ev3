/// <reference path="../node_modules/pxt-core/built/pxteditor.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

import { deployCoreAsync, initAsync } from "./deploy";
import { FieldPorts } from "./field_ports";
import { FieldImages } from "./field_images";
import { FieldSpeed } from "./field_speed";
import { FieldBrickButtons } from "./field_brickbuttons";
import { FieldTurnRatio } from "./field_turnratio";

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
        }, {
            selector: "speed",
            editor: FieldSpeed
        }, {
            selector: "brickbuttons",
            editor: FieldBrickButtons
        }, {
            selector: "turnratio",
            editor: FieldTurnRatio
        }],
        deployCoreAsync,
        showUploadInstructionsAsync: (fn: string, url: string, confirmAsync: (options: any) => Promise<number>) => {
            let resolve: (thenableOrResult?: void | PromiseLike<void>) => void;
            let reject: (error: any) => void;
            const deferred = new Promise<void>((res, rej) => {
                resolve = res;
                reject = rej;
            });
            const boardName = pxt.appTarget.appTheme.boardName || "???";
            const boardDriveName = pxt.appTarget.appTheme.driveDisplayName || pxt.appTarget.compile.driveName || "???";

            // https://msdn.microsoft.com/en-us/library/cc848897.aspx
            // "For security reasons, data URIs are restricted to downloaded resources. 
            // Data URIs cannot be used for navigation, for scripting, or to populate frame or iframe elements"
            const downloadAgain = !pxt.BrowserUtils.isIE() && !pxt.BrowserUtils.isEdge();
            const docUrl = pxt.appTarget.appTheme.usbDocs;
            const saveAs = pxt.BrowserUtils.hasSaveAs();

            const htmlBody = `
            <div class="ui three column grid stackable">
                <div class="column">
                    <div class="ui">
                        <div class="image">
                            <img class="ui medium rounded image" src="./static/download/connect.svg" style="height:109px;width:261px;margin-bottom:1rem;">
                        </div>
                        <div class="content">
                            <div class="description">
                                <span class="ui yellow circular label">1</span>
                                <strong>${lf("Connect EV3 to computer with USB cable")}</strong>
                                <br/>
                                ${lf("Use the miniUSB port on top of EV3 brick")}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="ui">
                        <div class="image">
                            <img class="ui medium rounded image" src="./static/download/firmware.svg" style="height:109px;width:261px;margin-bottom:1rem;">
                        </div>
                        <div class="content">
                            <div class="description">
                                <span class="ui blue circular label">2</span>
                                <strong>${lf("Make sure you have the latest EV3 firmware")}</strong>
                                <br/>
                                <a href="https://ev3manager.education.lego.com/" target="_blank">${lf("Click here to update to latest firmware")}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column">
                    <div class="ui">
                        <div class="image">
                            <img class="ui medium rounded image" src="./static/download/transfer.svg" style="height:109px;width:261px;margin-bottom:1rem;">
                        </div>
                        <div class="content">
                            <div class="description">
                                <span class="ui blue circular label">3</span>
                                ${lf("Move the .uf2 file to EV3 brick")}
                                <br/>
                                ${lf("Locate the downloaded .uf2 file and drag it to the EV3 drive")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            return confirmAsync({
                header: lf("Download to your EV3"),
                htmlBody,
                hasCloseIcon: true,
                hideCancel: true,
                hideAgree: false,
                agreeLbl: lf("I got it"),
                buttons: [downloadAgain ? {
                    label: fn,
                    icon: "download",
                    class: "lightgrey focused",
                    url,
                    fileName: fn
                } : undefined, docUrl ? {
                    label: lf("Help"),
                    icon: "help",
                    class: "lightgrey",
                    url: docUrl
                } : undefined]
                //timeout: 20000
            }).then(() => { });
        }
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
