namespace pxsim.storage {
    export function __stringToBuffer(s: string): RefBuffer {
        // TODO
        return new RefBuffer(new Uint8Array([]));
    }

    export function __bufferToString(b: RefBuffer): string {
        // TODO
        return "";
    }

    export function __mkdir(fn: string) {
        // TODO
    }

    export function __unlink(filename: string): void { 
        // TODO
    }

    export function __truncate(filename: string): void { 
        // TODO
    }
}