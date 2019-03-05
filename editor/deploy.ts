/// <reference path="../node_modules/pxt-core/built/pxteditor.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

import UF2 = pxtc.UF2;

export let ev3: pxt.editor.Ev3Wrapper

export function debug() {
    return initAsync()
        .then(w => w.downloadFileAsync("/tmp/dmesg.txt", v => console.log(pxt.Util.uint8ArrayToString(v))))
}

function hf2Async() {
    return pxt.HF2.mkPacketIOAsync()
        .then(h => {
            let w = new pxt.editor.Ev3Wrapper(h)
            ev3 = w
            return w.reconnectAsync(true)
                .then(() => w)
        })
}

let noHID = false

let initPromise: Promise<pxt.editor.Ev3Wrapper>
export function initAsync() {
    if (initPromise)
        return initPromise

    let canHID = false
    if (pxt.U.isNodeJS) {
        // doesn't seem to work ATM
        canHID = false
    } else {
        const forceHexDownload = /forceHexDownload/i.test(window.location.href);
        if (pxt.BrowserUtils.isLocalHost() && pxt.Cloud.localToken && !forceHexDownload)
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

// this comes from aux/pxt.lms
const rbfTemplate = `
4c45474f580000006d000100000000001c000000000000000e000000821b038405018130813e8053
74617274696e672e2e2e0084006080XX00448581644886488405018130813e80427965210084000a
`
export function deployCoreAsync(resp: pxtc.CompileResult) {
    let w: pxt.editor.Ev3Wrapper

    let filename = resp.downloadFileBaseName || "pxt"
    filename = filename.replace(/^lego-/, "")

    let fspath = "../prjs/BrkProg_SAVE/"

    let elfPath = fspath + filename + ".elf"
    let rbfPath = fspath + filename + ".rbf"

    let rbfHex = rbfTemplate
        .replace(/\s+/g, "")
        .replace("XX", pxt.U.toHex(pxt.U.stringToUint8Array(elfPath)))
    let rbfBIN = pxt.U.fromHex(rbfHex)
    pxt.HF2.write16(rbfBIN, 4, rbfBIN.length)

    let origElfUF2 = UF2.parseFile(pxt.U.stringToUint8Array(ts.pxtc.decodeBase64(resp.outfiles[pxt.outputName()])))

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
        if (pxt.commands && pxt.commands.electronDeployAsync) {
            return pxt.commands.electronDeployAsync(resp);
        }
        if (pxt.commands && pxt.commands.saveOnlyAsync) {
            return pxt.commands.saveOnlyAsync(resp);
        }
        return Promise.resolve();
    }

    if (noHID) return saveUF2Async()

    return initAsync()
        .then(w_ => {
            w = w_
            if (w.isStreaming)
                pxt.U.userError("please stop the program first")
            return w.stopAsync()
        })
        .then(() => w.rmAsync(elfPath))
        .then(() => w.flashAsync(elfPath, UF2.readBytes(origElfUF2, 0, origElfUF2.length * 256)))
        .then(() => w.flashAsync(rbfPath, rbfBIN))
        .then(() => w.runAsync(rbfPath))
        .then(() => {
            return w.disconnectAsync()
            //return Promise.delay(1000).then(() => w.dmesgAsync())
        }).catch(e => {
            // if we failed to initalize, retry
            if (noHID)
                return saveUF2Async()
            else
                return Promise.reject(e)
        })
}
