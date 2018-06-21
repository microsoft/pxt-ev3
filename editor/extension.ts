/// <reference path="../node_modules/pxt-core/built/pxteditor.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

import { deployCoreAsync, initAsync } from "./deploy";

pxt.editor.initExtensionsAsync = function (opts: pxt.editor.ExtensionOptions): Promise<pxt.editor.ExtensionResult> {
    pxt.debug('loading pxt-ev3 target extensions...')
    const res: pxt.editor.ExtensionResult = {
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
            <div class="ui grid stackable">
                <div class="column five wide" style="background-color: #E2E2E2;">
                    <div class="ui header">${lf("First time here?")}</div>
                    <strong style="font-size:small">${lf("You must have version 1.10E or above of the firmware")}</strong>
                    <div style="justify-content: center;display: flex;padding: 1rem;">
                        <img class="ui image" src="./static/download/firmware.png" style="height:100px;" />
                    </div>
                    <a href="/troubleshoot" target="_blank">${lf("Check your firmware version here and update if needed")}</a>
                </div>
                <div class="column eleven wide">
                    <div class="ui grid">
                        <div class="row">
                            <div class="column">
                                <div class="ui two column grid padded">
                                    <div class="column">
                                        <div class="ui">
                                            <div class="image">
                                                <img class="ui medium rounded image" src="./static/download/connect.svg" style="height:109px;width:261px;margin-bottom:1rem;" />
                                            </div>
                                            <div class="content">
                                                <div class="description">
                                                    <span class="ui yellow circular label">1</span>
                                                    <strong>${lf("Connect the EV3 to your computer with a USB cable")}</strong>
                                                    <br />
                                                    <span style="font-size:small">${lf("Use the miniUSB port on the top of the EV3 Brick")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="column">
                                        <div class="ui">
                                            <div class="image">
                                                <img class="ui medium rounded image" src="./static/download/transfer.svg" style="height:109px;width:261px;margin-bottom:1rem;" />
                                            </div>
                                            <div class="content">
                                                <div class="description">
                                                    <span class="ui yellow circular label">2</span>
                                                    <strong>${lf("Move the .uf2 file to the EV3 Brick")}</strong>
                                                    <br />
                                                    <span style="font-size:small">${lf("Locate the downloaded .uf2 file and drag it to the EV3 USB drive")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                className: 'downloaddialog',
                buttons: [downloadAgain ? {
                    label: fn,
                    icon: "download",
                    className: "lightgrey focused",
                    url,
                    fileName: fn
                } : undefined, docUrl ? {
                    label: lf("Help"),
                    icon: "help",
                    className: "lightgrey",
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

// When require()d from node, bind the global pxt namespace
// namespace pxt {
//     export const dummyExport = 1;
// }
// eval("if (typeof process === 'object' && process + '' === '[object process]') pxt = global.pxt")
