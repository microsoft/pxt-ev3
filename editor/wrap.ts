namespace pxt.editor {
    import HF2 = pxt.HF2
    import U = pxt.U

    function log(msg: string) {
        pxt.log("EWRAP: " + msg)
    }

    export interface DirEntry {
        name: string;
        md5?: string;
        size?: number;
    }

    const runTemplate = "C00882010084XX0060640301606400"

    export class Ev3Wrapper {
        msgs = new U.PromiseBuffer<Uint8Array>()
        private cmdSeq = U.randomUint32() & 0xffff;

        constructor(public io: pxt.HF2.PacketIO) {
            io.onData = buf => {
                buf = buf.slice(0, HF2.read16(buf, 0) + 2)
                // log("DATA: " + U.toHex(buf))
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

        runAsync(path: string) {
            let codeHex = runTemplate.replace("XX", U.toHex(U.stringToUint8Array(path)))
            let code = U.fromHex(codeHex)
            let pkt = this.allocCore(2 + code.length, 0)
            HF2.write16(pkt, 5, 0x0800)
            U.memcpy(pkt, 7, code)
            log(`run ${path}`)
            return this.talkAsync(pkt)
                .then(buf => {
                })
        }

        talkAsync(buf: Uint8Array) {
            return this.io.sendPacketAsync(buf)
                .then(() => this.msgs.shiftAsync(1000))
                .then(resp => {
                    if (resp[2] != buf[2] || resp[3] != buf[3])
                        U.userError("msg count de-sync")
                    if (buf[4] == 1) {
                        if (resp[5] != buf[5])
                            U.userError("cmd de-sync")
                        if (resp[6] != 0 && resp[6] != 1 /* LS? */ && resp[6] != 8 /* EOF */)
                            U.userError("cmd error: " + resp[6])
                    }
                    return resp
                })
        }

        flashAsync(path: string, file: Uint8Array) {
            log(`write ${file.length} to ${path}`)
            let begin = this.allocSystem(4 + path.length + 1, 0x92)
            HF2.write32(begin, 6, file.length) // fileSize
            U.memcpy(begin, 10, U.stringToUint8Array(path))

            let loopAsync = (pos: number): Promise<void> => {
                if (pos >= file.length) return Promise.resolve()
                let size = file.length - pos
                if (size > 1000) size = 1000
                let upl = this.allocSystem(1 + size, 0x93, 0x1)
                upl[6] = handle
                U.memcpy(upl, 6 + 1, file, pos, size)
                return this.talkAsync(upl)
                    .then(() => loopAsync(pos + size))
            }

            let handle = -1
            return this.talkAsync(begin)
                .then(resp => {
                    handle = resp[7]
                    return loopAsync(0)
                })
        }

        lsAsync(path: string): Promise<DirEntry[]> {
            let lsReq = this.allocSystem(2 + path.length + 1, 0x99)
            HF2.write16(lsReq, 6, 1024) // maxRead
            U.memcpy(lsReq, 8, U.stringToUint8Array(path))

            return this.talkAsync(lsReq)
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


}