/// <reference path="../node_modules/pxt-core/built/pxteditor.d.ts" />

// When require()d from node, bind the global pxt namespace
namespace pxt {
    export const dummyExport = 1;
}
eval("if (typeof process === 'object' && process + '' === '[object process]') pxt = global.pxt")

namespace pxt.editor {
    import UF2 = pxtc.UF2;

    export let ev3: Ev3Wrapper

    export function debug() {
        return initAsync()
            .then(w => w.downloadFileAsync("/tmp/dmesg.txt", v => console.log(pxt.Util.uint8ArrayToString(v))))
    }

    // this comes from aux/pxt.lms
    const rbfTemplate = `
4c45474f580000006d000100000000001c000000000000000e000000821b038405018130813e8053
74617274696e672e2e2e0084006080XX00448581644886488405018130813e80427965210084000a
`

    function hf2Async() {
        return pxt.HF2.mkPacketIOAsync()
            .then(h => {
                let w = new Ev3Wrapper(h)
                ev3 = w
                return w.reconnectAsync(true)
                    .then(() => w)
            })
    }

    let noHID = false

    let initPromise: Promise<Ev3Wrapper>
    function initAsync() {
        if (initPromise)
            return initPromise

        let canHID = false
        if (U.isNodeJS) {
            canHID = true
        } else {
            const forceHexDownload = /forceHexDownload/i.test(window.location.href);
            if (Cloud.isLocalHost() && Cloud.localToken && !forceHexDownload)
                canHID = true
        }

        if (noHID)
            canHID = false

        if (canHID) {
            initPromise = hf2Async()
                .catch(err => {
                    initPromise = null
                    noHID = true
                    return Promise.reject(err)
                })
        } else {
            noHID = true
            initPromise = Promise.reject(new Error("no HID"))
        }

        return initPromise
    }

    export function deployCoreAsync(resp: pxtc.CompileResult, isCli = false) {
        let w: Ev3Wrapper

        let filename = resp.downloadFileBaseName || "pxt"
        filename = filename.replace(/^lego-/, "")

        let fspath = "../prjs/BrkProg_SAVE/"

        let elfPath = fspath + filename + ".elf"
        let rbfPath = fspath + filename + ".rbf"

        let rbfHex = rbfTemplate
            .replace(/\s+/g, "")
            .replace("XX", U.toHex(U.stringToUint8Array(elfPath)))
        let rbfBIN = U.fromHex(rbfHex)
        HF2.write16(rbfBIN, 4, rbfBIN.length)

        let origElfUF2 = UF2.parseFile(U.stringToUint8Array(atob(resp.outfiles[pxt.outputName()])))

        let mkFile = (ext: string, data: Uint8Array = null) => {
            let f = UF2.newBlockFile()
            f.filename = "Projects/" + filename + ext
            if (data)
                UF2.writeBytes(f, 0, data)
            return f
        }

        let elfUF2 = mkFile(".elf")
        for (let b of origElfUF2) {
            UF2.writeBytes(elfUF2, b.targetAddr, b.data)
        }

        let r = UF2.concatFiles([elfUF2, mkFile(".rbf", rbfBIN)])
        let data = UF2.serializeFile(r)

        resp.outfiles[pxtc.BINARY_UF2] = btoa(data)

        let saveUF2Async = () => {
            if (isCli || !pxt.commands.saveOnlyAsync) {
                return Promise.resolve()
            } else {
                return pxt.commands.saveOnlyAsync(resp)
            }
        }

        if (noHID) return saveUF2Async()

        return initAsync()
            .then(w_ => {
                w = w_
                if (w.isStreaming)
                    U.userError("please stop the program first")
                return w.stopAsync()
            })
            .then(() => w.rmAsync(elfPath))
            .then(() => w.flashAsync(elfPath, UF2.readBytes(origElfUF2, 0, origElfUF2.length * 256)))
            .then(() => w.flashAsync(rbfPath, rbfBIN))
            .then(() => w.runAsync(rbfPath))
            .then(() => {
                if (isCli)
                    return w.disconnectAsync()
                else
                    return Promise.resolve()
                //return Promise.delay(1000).then(() => w.dmesgAsync())
            }).catch(e => {
                // if we failed to initalize, retry
                if (noHID)
                    return saveUF2Async()
                else
                    return Promise.reject(e)
            })
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

    }

    initExtensionsAsync = function (opts: pxt.editor.ExtensionOptions): Promise<pxt.editor.ExtensionResult> {
        pxt.debug('loading pxt-ev3 target extensions...')
        updateBlocklyShape();
        const res: pxt.editor.ExtensionResult = {
            fieldEditors: [{
                selector: "ports",
                editor: FieldPorts
            }],
            deployCoreAsync
        };
        initAsync().catch(e => {
            // probably no HID - we'll try this again upon deployment
        })
        return Promise.resolve<pxt.editor.ExtensionResult>(res);
    }
}
