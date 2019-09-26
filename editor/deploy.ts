/// <reference path="../node_modules/pxt-core/built/pxteditor.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

import UF2 = pxtc.UF2;
import { Ev3Wrapper } from "./wrap";

export let ev3: Ev3Wrapper

export function debug() {
    return initHidAsync()
        .then(w => w.downloadFileAsync("/tmp/dmesg.txt", v => console.log(pxt.Util.uint8ArrayToString(v))))
}


// Web Serial API https://wicg.github.io/serial/
// chromium bug https://bugs.chromium.org/p/chromium/issues/detail?id=884928
// Under experimental features in Chrome Desktop 77+
enum ParityType {
    "none",
    "even",
    "odd",
    "mark",
    "space"
}
declare interface SerialOptions {
    baudrate?: number;
    databits?: number;
    stopbits?: number;
    parity?: ParityType;
    buffersize?: number;
    rtscts?: boolean;
    xon?: boolean;
    xoff?: boolean;
    xany?: boolean;
}
type SerialPortInfo = pxt.Map<string>;
type SerialPortRequestOptions = any;
declare class SerialPort {
    open(options?: SerialOptions): Promise<void>;
    close(): void;
    readonly readable: any;
    readonly writable: any;
    //getInfo(): SerialPortInfo;
}
declare interface Serial extends EventTarget {
    onconnect: any;
    ondisconnect: any;
    getPorts(): Promise<SerialPort[]>
    requestPort(options: SerialPortRequestOptions): Promise<SerialPort>;
}

class WebSerialPackageIO implements pxt.HF2.PacketIO {
    onData: (v: Uint8Array) => void;
    onError: (e: Error) => void;
    onEvent: (v: Uint8Array) => void;
    onSerial: (v: Uint8Array, isErr: boolean) => void;
    sendSerialAsync: (buf: Uint8Array, useStdErr: boolean) => Promise<void>;
    private _reader: any;
    private _writer: any;

    constructor(private port: SerialPort, private options: SerialOptions) {

        // start reading
        this.readSerialAsync();
    }

    async readSerialAsync() {
        this._reader = this.port.readable.getReader();
        while(!!this._reader) {
            const { done, value } = await this._reader.read()
            console.log(`serial: ${done}`, value)
            if (this.onData) this.onData(new Uint8Array(value));
        }
    }

    static isSupported(): boolean {
        return !!(<any>navigator).serial;
    }

    static async mkPacketIOAsync(): Promise<pxt.HF2.PacketIO> {
        const serial = (<any>navigator).serial;
        if (serial) {
            console.log(`web serial detected`)
            try {
                const requestOptions: SerialPortRequestOptions = {};
                const port = await serial.requestPort(requestOptions);
                const options: SerialOptions = {
                    baudrate: 115200,
                };
                await port.open(options);
                if (port) {
                    return new WebSerialPackageIO(port, options);
                }
            } catch (e) {
                console.log(`connection error`, e)
            }
        }

        console.log(`unable to setup serial`)
        return undefined;
    }

    error(msg: string): any {
        console.error(msg);
        throw new Error(lf("error on brick ({0})", msg))
    }

    async reconnectAsync(): Promise<void> {
        console.log(`serial: reconnect`)
        await this.port.open(this.options);
        this.readSerialAsync();
        return Promise.resolve();
    }

    async disconnectAsync(): Promise<void> {
        console.log(`serial: disconnect`);
        this.port.close();
        this._reader = undefined;
        this._writer = undefined;
        return Promise.resolve();
    }

    sendPacketAsync(pkt: Uint8Array): Promise<void> {
        console.log(`serial: send ${pkt.length} bytes`)
        if (!this._writer)
            this._writer = this.port.writable.getWriter();
        return this._writer.write(pkt);
    }
}

function hf2Async() {
    const pktIOAsync: Promise<pxt.HF2.PacketIO> = WebSerialPackageIO.isSupported()
        ? WebSerialPackageIO.mkPacketIOAsync() : pxt.HF2.mkPacketIOAsync()
    return pktIOAsync.then(h => {
        let w = new Ev3Wrapper(h)
        ev3 = w
        return w.reconnectAsync(true)
            .then(() => w)
    })
}

let noHID = false
let canHID = false;
export function initAsync(): Promise<void> {
    if (pxt.U.isNodeJS) {
        // doesn't seem to work ATM
        canHID = false
    } else {
        const forceHexDownload = /forceHexDownload/i.test(window.location.href);
        if (pxt.Cloud.isLocalHost() && pxt.Cloud.localToken && !forceHexDownload)
            canHID = true;
        else if (WebSerialPackageIO.isSupported())
            canHID = true;
    }

    if (noHID)
        canHID = false

    console.log(`nohid ${noHID} canHID ${canHID}`)
    return Promise.resolve();
}

let initPromise: Promise<Ev3Wrapper>
function initHidAsync() { // needs to run within a click handler
    if (initPromise)
        return initPromise
    if (canHID) {
        initPromise = hf2Async()
            .catch(err => {
                console.error(err);
                initPromise = null
                noHID = true
                return Promise.reject(err)
            })
    } else {
        noHID = true
        initPromise = Promise.reject(new Error("no HID"))
    }
    return initPromise;
}

// this comes from aux/pxt.lms
const rbfTemplate = `
4c45474f580000006d000100000000001c000000000000000e000000821b038405018130813e8053
74617274696e672e2e2e0084006080XX00448581644886488405018130813e80427965210084000a
`
export function deployCoreAsync(resp: pxtc.CompileResult) {
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

    let w: Ev3Wrapper;
    return initHidAsync()
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
