/// <reference path="../node_modules/pxt-core/built/pxteditor.d.ts" />

// When require()d from node, bind the global pxt namespace
namespace pxt {
    export const dummyExport = 1;
}
eval("if (typeof process === 'object' && process + '' === '[object process]') pxt = global.pxt")

namespace pxt.editor {
    // this comes from aux/pxt.lms
    const rbfTemplate = `
4c45474f710000006d000100000000001c000000000000000a000000821b028405018130813e8053
74617274696e672e2e2e008400c002802f746d702f73657269616c2e74787400486080XX00448303
83010640414082f5ff8405018130813e80427965210084000a
`

    function hf2Async() {
        return pxt.HF2.mkPacketIOAsync()
            .then(h => {
                let w = new Ev3Wrapper(h)
                return w.reconnectAsync(true)
                    .then(() => w)
            })
    }

    let initPromise: Promise<Ev3Wrapper>
    function initAsync() {
        if (!initPromise)
            initPromise = hf2Async()
                .catch(err => {
                    initPromise = null
                    return Promise.reject(err)
                })
        return initPromise
    }

    export function deployCoreAsync(resp: pxtc.CompileResult, isCli = false) {
        let w: Ev3Wrapper
        let elfPath = "../prjs/BrkProg_SAVE/binary.elf"
        let rbfPath = "../prjs/BrkProg_SAVE/pxt0.rbf"
        return initAsync()
            .then(w_ => {
                w = w_
                if (w.isStreaming)
                    U.userError("please stop the program first")
            }).then(() => {
                let f = U.stringToUint8Array(atob(resp.outfiles[pxt.outputName()]))
                return w.flashAsync(elfPath, f)
            }).then(() => {
                let rbfHex = rbfTemplate
                    .replace(/\s+/g, "")
                    .replace("XX", U.toHex(U.stringToUint8Array(elfPath)))
                let rbf = U.fromHex(rbfHex)
                HF2.write16(rbf, 4, rbf.length)
                return w.flashAsync(rbfPath, rbf)
            }).then(() => {
                return w.runAsync(rbfPath)
            }).then(() => {
                if (isCli)
                    return w.disconnectAsync()
                else
                    return Promise.resolve()
            })
    }

    initExtensionsAsync = function (opts: pxt.editor.ExtensionOptions): Promise<pxt.editor.ExtensionResult> {
        pxt.debug('loading pxt-ev3 target extensions...')
        const res: pxt.editor.ExtensionResult = {
            deployCoreAsync,
        };
        initAsync()
            .then(w => w.streamFileAsync("/tmp/serial.txt", buf => {
                let str = Util.fromUTF8(Util.uint8ArrayToString(buf))
                window.postMessage({
                    type: 'serial',
                    id: 'n/a', // TODO
                    data: str
                }, "*")
            }))
        return Promise.resolve<pxt.editor.ExtensionResult>(res);
    }
}
