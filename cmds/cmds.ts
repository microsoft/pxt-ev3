/// <reference path="../node_modules/pxt-core/built/pxtlib.d.ts" />

import * as fs from 'fs';

require("./editor")

declare namespace pxt.editor {
    function deployCoreAsync(resp: pxtc.CompileResult, disconnect?: boolean): Promise<void>;
}

export function deployCoreAsync(resp: pxtc.CompileResult) {
    return pxt.editor.deployCoreAsync(resp, process.env["PXT_SERIAL"] ? false : true)
        .then(() => {
            fs.writeFileSync("built/full-" + pxtc.BINARY_UF2, resp.outfiles[pxtc.BINARY_UF2], {
                encoding: "base64"
            })
        })
}
