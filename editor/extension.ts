/// <reference path="../node_modules/pxt-core/localtypings/pxtarget.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtblocks.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtcompiler.d.ts" />
/// <reference path="../node_modules/pxt-core/built/pxtlib.d.ts" />
/// <reference path="../node_modules/pxt-core/localtypings/pxteditor.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

import { deployCoreAsync, initAsync } from "./deploy";
import { showUploadDialogAsync } from "./dialogs";

export let projectView: pxt.editor.IProjectView;

pxt.editor.initExtensionsAsync = function (opts: pxt.editor.ExtensionOptions): Promise<pxt.editor.ExtensionResult> {
    pxt.debug('loading pxt-ev3 target extensions...')
    projectView = opts.projectView;

    const res: pxt.editor.ExtensionResult = {
        deployAsync: deployCoreAsync,
        showUploadInstructionsAsync: showUploadDialogAsync
    };

    initAsync().catch(e => {
        // probably no HID - we'll try this again upon deployment
    })
    return Promise.resolve<pxt.editor.ExtensionResult>(res);
}
