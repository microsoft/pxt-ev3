/**
 * See https://www.lego.com/cdn/cs/set/assets/blt6879b00ae6951482/LEGO_MINDSTORMS_EV3_Communication_Developer_Kit.pdf
 * https://github.com/mindboards/ev3sources/blob/master/lms2012/lms2012/source/bytecodes.h#L146
 */
import HF2 = pxt.HF2
import U = pxt.U

function log(msg: string) {
    pxt.log("serial: " + msg)
}

export interface DirEntry {
    name: string;
    md5?: string;
    size?: number;
}

const runTemplate = "C00882010084XX0060640301606400"
const usbMagic = 0x3d3f
const DIRECT_COMMAND_NO_REPLY = 0x80

export class Ev3Wrapper {
    msgs = new U.PromiseBuffer<Uint8Array>()
    private cmdSeq = U.randomUint32() & 0xffff;
    private lock = new U.PromiseQueue();
    isStreaming = false;
    dataDump = /talkdbg=1/.test(window.location.href);

    constructor(public io: pxt.packetio.PacketIO) {
        io.onData = buf => {
            buf = buf.slice(0, HF2.read16(buf, 0) + 2)
            if (HF2.read16(buf, 4) == usbMagic) {
                let code = HF2.read16(buf, 6)
                let payload = buf.slice(8)
                if (code == 1) {
                    let str = U.uint8ArrayToString(payload)
                    if (U.isNodeJS)
                        pxt.debug("SERIAL: " + str.replace(/\n+$/, ""))
                    else
                        window.postMessage({
                            type: 'serial',
                            id: 'n/a', // TODO?
                            data: str
                        }, "*")
                } else
                    pxt.debug("Magic: " + code + ": " + U.toHex(payload))
                return
            }
            if (this.dataDump)
                log("RECV: " + U.toHex(buf))
            this.msgs.push(buf)
        }
    }

    private allocCore(addSize: number, replyType: number) {
        let len = 5 + addSize
        let buf = new Uint8Array(len)
        HF2.write16(buf, 0, len - 2)  // pktLen
        HF2.write16(buf, 2, this.cmdSeq++) // msgCount
        buf[4] = replyType
        return buf
    }

    private allocSystem(addSize: number, cmd: number, replyType = 1) {
        let buf = this.allocCore(addSize + 1, replyType)
        buf[5] = cmd
        return buf
    }

    private allocCustom(code: number, addSize = 0) {
        let buf = this.allocCore(1 + 2 + addSize, 0)
        HF2.write16(buf, 4, usbMagic)
        HF2.write16(buf, 6, code)
        return buf
    }

    stopAsync() {
        return this.isVmAsync()
            .then(vm => {
                if (vm) return Promise.resolve();
                log(`stopping PXT app`)
                let buf = this.allocCustom(2)
                return this.justSendAsync(buf)
                    .then(() => pxt.U.delay(500))
            })
    }

    dmesgAsync() {
        log(`asking for DMESG buffer over serial`)
        let buf = this.allocCustom(3)
        return this.justSendAsync(buf)
    }

    runAsync(path: string) {
        let codeHex = runTemplate.replace("XX", U.toHex(U.stringToUint8Array(path)))
        let code = U.fromHex(codeHex)
        let pkt = this.allocCore(2 + code.length, DIRECT_COMMAND_NO_REPLY)
        HF2.write16(pkt, 5, 0x0800)
        U.memcpy(pkt, 7, code)
        log(`run ${path}`)
        return this.justSendAsync(pkt)
    }

    justSendAsync(buf: Uint8Array) {
        return this.lock.enqueue("talk", () => {
            this.msgs.drain()
            if (this.dataDump)
                log("SEND: " + U.toHex(buf))
            return this.io.sendPacketAsync(buf)
        })
    }

    dumpInputCmd(buf : Uint8Array) {
        log(`Reply size: ${HF2.read16(buf, 0)}`);
        log(`Message counter: ${HF2.read16(buf, 2)}`);
        log(`Reply type: ${buf[4]}`);
        switch (buf[5]) {
            case 0x03:
                log("System command: System command reply OK");
                break;
            case 0x05:
                log("System command: System command reply ERROR");
                break;
            case 0x00:
                log("Reply Status SUCCESS");
                break;
            case 0x01:
                log("Reply Status UNKNOWN_HANDLE");
                break;
            case 0x02:
                log("Reply Status HANDLE_NOT_READY");
                break;
            case 0x03:
                log("Reply Status CORRUPT_FILE");
                break;
            case 0x04:
                log("Reply Status NO_HANDLES_AVAILABLE");
                break;
            case 0x05:
                log("Reply Status NO_PERMISSION");
                break;
            case 0x06:
                log("Reply Status ILLEGAL_PATH");
                break;
            case 0x07:
                log("Reply Status FILE_EXITS");
                break;
            case 0x08:
                log("Reply Status END_OF_FILE");
                break;
            case 0x09:
                log("Reply Status SIZE_ERROR");
                break;
            case 0x0A:
                log("Reply Status UNKNOWN_ERROR");
                break;
            case 0x0B:
                log("Reply Status ILLEGAL_FILENAME");
                break;
            case 0x0C:
                log("Reply Status ILLEGAL_CONNECTION");
                break;
        }
    }

    dumpOutputCmd(buf: Uint8Array) {
        log(`Command size: ${HF2.read16(buf, 0)}`);
        log(`Message counter: ${HF2.read16(buf, 2)}`);
        log(`Command type: ${buf[4]}`);
        switch (buf[5]) {
            case 0x01:
                log("System command, reply required");
                break;
            case 0x81:
                log("System command, reply not require");
                break;
            case 0x92:
                log("System command: Begin file download");
                break;
            case 0x93:
                log("System command: Continue file download");
                break;
            case 0x94:
                log("System command: Begin file upload");
                break;
            case 0x95:
                log("System command: Continue file upload");
                break;
            case 0x96:
                log("System command: Begin get bytes from a file (while writing to the file)");
                break;
            case 0x97:
                log("System command: Continue get byte from a file (while writing to the file)");
                break;
            case 0x98:
                log("System command: Close file handle");
                break;
            case 0x99:
                log("System command: List files");
                break;
            case 0x9A:
                log("System command: Continue list files");
                break;
            case 0x9B:
                log("System command: Create directory");
                break;
            case 0x9C:
                log("System command: Delete");
                break;
            case 0x9D:
                log("System command: List handles");
                break;
            case 0x9E:
                log("System command: Write to mailbox");
                break;
            case 0x9F:
                log("System command: Transfer trusted pin code to brick");
                break;
            case 0xA0:
                log("System command: Restart the brick in Firmware update mode");
                break;
        }
    }

    talkAsync(buf: Uint8Array, altResponse = 0) {
        return this.lock.enqueue("talk", () => {
            this.msgs.drain()
            if (this.dataDump)
                log("TALK: " + U.toHex(buf))
            this.dumpOutputCmd(buf)
            return this.io.sendPacketAsync(buf)
                .then(() => this.msgs.shiftAsync(5000))
                .then(resp => {
                    this.dumpInputCmd(resp)
                    if (resp[2] != buf[2] || resp[3] != buf[3])
                        U.userError("msg count de-sync")
                    if (buf[4] == 1) {
                        if (altResponse != -1 && resp[5] != buf[5])
                            U.userError("cmd de-sync")
                        if (altResponse != -1 && resp[6] != 0 && resp[6] != altResponse)
                            U.userError("cmd error: " + resp[6])
                    }
                    return resp
                })
        })
    }

    flashAsync(path: string, file: Uint8Array) {
        log(`write ${file.length} bytes to ${path}`)

        let handle = -1

        let loopAsync = (pos: number): Promise<void> => {
            if (pos >= file.length) return Promise.resolve()
            let size = file.length - pos
            if (size > 1000) size = 1000
            let upl = this.allocSystem(1 + size, 0x93, 0x1)
            upl[6] = handle
            U.memcpy(upl, 6 + 1, file, pos, size)
            return this.talkAsync(upl, 8) // 8=EOF
                .then(() => loopAsync(pos + size))
        }

        let begin = this.allocSystem(4 + path.length + 1, 0x92)
        HF2.write32(begin, 6, file.length) // fileSize
        U.memcpy(begin, 10, U.stringToUint8Array(path))
        return this.lock.enqueue("file", () =>
            this.talkAsync(begin)
                .then(resp => {
                    handle = resp[7]
                    return loopAsync(0)
                }))
    }

    lsAsync(path: string): Promise<DirEntry[]> {
        let lsReq = this.allocSystem(2 + path.length + 1, 0x99)
        HF2.write16(lsReq, 6, 1024) // maxRead
        U.memcpy(lsReq, 8, U.stringToUint8Array(path))

        return this.talkAsync(lsReq, 8)
            .then(resp =>
                U.uint8ArrayToString(resp.slice(12)).split(/\n/).map(s => {
                    if (!s) return null as DirEntry
                    let m = /^([A-F0-9]+) ([A-F0-9]+) ([^\/]*)$/.exec(s)
                    if (m)
                        return {
                            md5: m[1],
                            size: parseInt(m[2], 16),
                            name: m[3]
                        }
                    else
                        return {
                            name: s.replace(/\/$/, "")
                        }
                }).filter(v => !!v))
    }

    rmAsync(path: string): Promise<void> {
        log(`rm ${path}`)
        let rmReq = this.allocSystem(path.length + 1, 0x9c)
        U.memcpy(rmReq, 6, U.stringToUint8Array(path))

        return this.talkAsync(rmReq, 5)
            .then(resp => { })
    }

    isVmAsync(): Promise<boolean> {
        let path = "/no/such/dir"
        let mkdirReq = this.allocSystem(path.length + 1, 0x9b)
        U.memcpy(mkdirReq, 6, U.stringToUint8Array(path))
        return this.talkAsync(mkdirReq, -1)
            .then(resp => {
                let isVM = resp[6] == 0x05
                log(`${isVM ? "PXT app" : "VM"} running`)
                return isVM
            })
    }

    private streamFileOnceAsync(path: string, cb: (d: Uint8Array) => void) {
        let fileSize = 0
        let filePtr = 0
        let handle = -1
        let resp = (buf: Uint8Array): Promise<void> => {
            if (buf[6] == 2) {
                // handle not ready - file is missing
                this.isStreaming = false
                return Promise.resolve()
            }

            if (buf[6] != 0 && buf[6] != 8)
                U.userError("bad response when streaming file: " + buf[6] + " " + U.toHex(buf))

            this.isStreaming = true
            fileSize = HF2.read32(buf, 7)
            if (handle == -1) {
                handle = buf[11]
                log(`stream on, handle=${handle}`)
            }
            let data = buf.slice(12)
            filePtr += data.length
            if (data.length > 0)
                cb(data)

            if (buf[6] == 8) {
                // end of file
                this.isStreaming = false
                return this.rmAsync(path)
            }

            let contFileReq = this.allocSystem(1 + 2, 0x97)
            HF2.write16(contFileReq, 7, 1000) // maxRead
            contFileReq[6] = handle
            return pxt.U.delay(data.length > 0 ? 0 : 500)
                .then(() => this.talkAsync(contFileReq, -1))
                .then(resp)
        }

        let getFileReq = this.allocSystem(2 + path.length + 1, 0x96)
        HF2.write16(getFileReq, 6, 1000) // maxRead
        U.memcpy(getFileReq, 8, U.stringToUint8Array(path))
        return this.talkAsync(getFileReq, -1).then(resp)
    }

    streamFileAsync(path: string, cb: (d: Uint8Array) => void) {
        let loop = (): Promise<void> =>
            this.lock.enqueue("file", () =>
                this.streamFileOnceAsync(path, cb))
                .then(() => pxt.U.delay(500))
                .then(loop)
        return loop()
    }


    downloadFileAsync(path: string, cb: (d: Uint8Array) => void) {
        return this.lock.enqueue("file", () =>
            this.streamFileOnceAsync(path, cb))
    }


    private initAsync() {
        return Promise.resolve()
    }

    private resetState() {

    }

    reconnectAsync(first = false): Promise<void> {
        this.resetState()
        if (first) return this.initAsync()
        log(`reconnect`);
        return this.io.reconnectAsync()
            .then(() => this.initAsync())
    }

    disconnectAsync() {
        log(`disconnect`);
        return this.io.disconnectAsync()
    }
}
