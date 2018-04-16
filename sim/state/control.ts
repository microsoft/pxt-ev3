/// <reference path="../../libs/core/enums.d.ts"/>

namespace pxsim.MMapMethods {
    export interface MMapImpl {
        data?: Uint8Array;
        afterMemWrite?: () => void;
        beforeMemRead?: () => void;
        read?: (d: Buffer) => number;
        write?: (d: Buffer) => number;
        ioctl?: (id: number, d: Buffer) => number;
        lseek?: (offset: number, whence: number) => number;
    }

    import BM = pxsim.BufferMethods
    import NumberFormat = BM.NumberFormat
    import Buffer = pxsim.RefBuffer

    export class MMap extends pxsim.RefObject {
        constructor(public impl: MMapImpl, public len: number) {
            super()
            if (!impl.data) impl.data = new Uint8Array(this.len)
            if (!impl.afterMemWrite) impl.afterMemWrite = () => { }
            if (!impl.beforeMemRead) impl.beforeMemRead = () => { }
            if (!impl.read) impl.read = () => 0
            if (!impl.write) impl.write = () => 0
            if (!impl.ioctl) impl.ioctl = () => -1
            if (!impl.lseek) impl.lseek = (offset, whence) => -1
        }
        destroy() {
        }
        buf(): Buffer {
            return { data: this.impl.data } as any
        }
    }

    export const mmapRegistry: pxt.Map<MMapImpl> = {}

    export function register(filename: string, impl: MMapImpl) {
        mmapRegistry[filename] = impl
    }

    export function setNumber(m: MMap, format: NumberFormat, offset: number, value: number): void {
        BM.setNumber(m.buf(), format, offset, value)
        m.impl.afterMemWrite();
    }

    export function getNumber(m: MMap, format: NumberFormat, offset: number): number {
        m.impl.beforeMemRead()
        return BM.getNumber(m.buf(), format, offset)
    }

    export function slice(m: MMap, offset?: number, length?: number): Buffer {
        m.impl.beforeMemRead()
        return BM.slice(m.buf(), offset, length)
    }

    export function length(m: MMap): number {
        m.impl.beforeMemRead()
        return m.buf().data.length
    }

    export function ioctl(m: MMap, id: number, data: Buffer): number {
        return m.impl.ioctl(id, data)
    }

    export function write(m: MMap, data: Buffer): number {
        return m.impl.write(data)
    }

    export function read(m: MMap, data: Buffer): number {
        return m.impl.read(data)
    }

    export function lseek(m: MMap, offset: number, whence: number): number {
        return m.impl.lseek(offset, whence);
    }
}

namespace pxsim.control {

    export function mmap(filename: string, size: number, offset: number): MMapMethods.MMap {
        let impl = MMapMethods.mmapRegistry[filename]
        if (!impl) impl = {}
        return new MMapMethods.MMap(impl, size)
    }

    export function dmesg(s: string) {
        //console.log("DMESG: " + s)
    }
}

namespace pxsim.output {
    export function createBuffer(size: number) {
        return BufferMethods.createBuffer(size)
    }
}