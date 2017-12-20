namespace storage {
    //% shim=storage::unlink
    function unlink(filename: string): void { }
    //% shim=storage::truncate
    function truncate(filename: string): void { }

    export function mapFilename(filename: string) {
        if (filename[0] != '/') filename = '/tmp/logs/' + filename
        return filename
    }

    function getFile(filename: string) {
        filename = mapFilename(filename)
        let r = control.mmap(filename, 0, 0)
        if (!r) {
            mkdir(dirname(filename))
            truncate(filename)
            r = control.mmap(filename, 0, 0)
        }
        if (!r)
            control.panic(906)
        return r
    }

    export function dirname(filename: string) {
        let last = 0
        for (let i = 0; i < filename.length; ++i)
            if (filename[i] == "/")
                last = i
        return filename.substr(0, last)
    }

    /** Append string data to a new or existing file. */
    export function append(filename: string, data: string): void {
        appendBuffer(filename, stringToBuffer(data))
    }

    /** Append a buffer to a new or existing file. */
    export function appendBuffer(filename: string, data: Buffer): void {
        let f = getFile(filename);
        f.lseek(0, SeekWhence.End)
        f.write(data)
    }

    /** Overwrite file with string data. */
    export function overwrite(filename: string, data: string): void {
        overwriteWithBuffer(filename, stringToBuffer(data))
    }

    /** Overwrite file with a buffer. */
    export function overwriteWithBuffer(filename: string, data: Buffer): void {
        truncate(mapFilename(filename))
        appendBuffer(filename, data)
    }

    /** Return true if the file already exists. */
    export function exists(filename: string): boolean {
        return !!control.mmap(mapFilename(filename), 0, 0);
    }

    /** Delete a file, or do nothing if it doesn't exist. */
    export function remove(filename: string): void {
        unlink(mapFilename(filename))
    }

    /** Return the size of the file, or -1 if it doesn't exists. */
    export function size(filename: string): int32 {
        let f = control.mmap(mapFilename(filename), 0, 0)
        if (!f) return -1;
        return f.lseek(0, SeekWhence.End)
    }

    /** Read contents of file as a string. */
    export function read(filename: string): string {
        return bufferToString(readAsBuffer(filename))
    }

    /** Read contents of file as a buffer. */
    export function readAsBuffer(filename: string): Buffer {
        let f = getFile(filename)
        let sz = f.lseek(0, SeekWhence.End)
        let b = output.createBuffer(sz)
        f.lseek(0, SeekWhence.Set);
        f.read(b)
        return b
    }
}