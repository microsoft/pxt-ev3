namespace storage {

    export enum Separators {
        //% block="comma"
        Comma,
        //% block="semicolon"
        Semicolon
    }

    //% shim=storage::__unlink
    function __unlink(filename: string): void { }
    //% shim=storage::__truncate
    function __truncate(filename: string): void { }

    let csvSeparator = separatorConverter(Separators.Comma);

    //% fixedInstances
    export class Storage {

        constructor() {
        }

        protected mapFilename(filename: string) {
            return filename;
        }

        private getFile(filename: string): MMap {
            filename = this.mapFilename(filename)
            let r = control.mmap(filename, 0, 0)
            if (!r) {
                __mkdir(this.dirname(filename))
                __truncate(filename)
                r = control.mmap(filename, 0, 0)
            }
            if (!r)
                control.panic(906)
            return r
        }

        dirname(filename: string) {
            let last = 0
            for (let i = 0; i < filename.length; ++i)
                if (filename[i] == "/")
                    last = i
            return filename.substr(0, last)
        }

        /**
         * Append string data to a new or existing file.
         * @param filename the file name to append data, eg: "data.txt"
         * @param data the data to append
         */
        //% blockId=storageAppend block="storage %source|%filename|append %data"
        //% weight=94
        append(filename: string, data: string): void {
            this.appendBuffer(filename, __stringToBuffer(data))
        }

        /**
         * Appends a new line of data in the file.
         * @param filename the file name to append data, eg: "data.txt"
         * @param data the data to append
         */
        //% blockId=storageAppendLine block="storage %source|%filename|append line %data"
        //% weight=93
        appendLine(filename: string, data: string): void {
            this.append(filename, data + "\r\n");
        }

        /** Append a buffer to a new or existing file. */
        appendBuffer(filename: string, data: Buffer): void {
            let f = this.getFile(filename);
            f.lseek(0, SeekWhence.End)
            f.write(data)
        }

        /**
         * Append a row of CSV headers.
         * @param filename the file name to append data, eg: "data.csv"
         * @param headers the data to append
         */
        //% blockId=storageAppendCSVHeaders block="storage %source|%filename|append CSV headers %headers"
        //% weight=89
        appendCSVHeaders(filename: string, headers: string[]) {
            let s = ""
            for (const d of headers) {
                if (s) s += csvSeparator;
                s = s + d;
            }
            s += "\r\n"
            this.append(filename, s)
        }

        /**
         * Append a row of CSV data.
         * @param filename the file name to append data, eg: "data.csv"
         * @param data the data to append
         */
        //% blockId=storageAppendCSV block="storage %source|%filename|append CSV %data"
        //% weight=88
        appendCSV(filename: string, data: number[]) {
            let s = toCSV(data, csvSeparator);
            this.append(filename, s)
        }

        /**
         * Overwrite file with string data.
         * @param filename the file name to append data, eg: "data.txt"
         * @param data the data to append
         */
        //% blockId=storageOverwrite block="storage %source|%filename|overwrite with|%data"
        //% weight=95
        overwrite(filename: string, data: string): void {
            this.overwriteWithBuffer(filename, __stringToBuffer(data))
        }

        /** Overwrite file with a buffer. */
        overwriteWithBuffer(filename: string, data: Buffer): void {
            __truncate(this.mapFilename(filename))
            this.appendBuffer(filename, data)
        }

        /**
         * Tests if a file exists.
         * @param filename the file name to append data, eg: "data.txt"
         */
        //% blockId=storageExists block="storage %source|%filename|exists"
        //% weight=99
        exists(filename: string): boolean {
            return !!control.mmap(this.mapFilename(filename), 0, 0);
        }

        /**
         * Delete a file, or do nothing if it doesn't exist.
         * @param filename the file name to append data, eg: "data.txt"
         */
        //% blockId=storageRemove block="storage %source|remove %filename"
        //% weight=97
        remove(filename: string): void {
            __unlink(this.mapFilename(filename))
        }

        /**
         * Return the size of the file, or -1 if it doesn't exists.
         * @param filename the file name to append data, eg: "data.txt"
         */
        //% blockId=storageSize block="storage %source|%filename|size"
        //% weight=98
        size(filename: string): int32 {
            let f = control.mmap(this.mapFilename(filename), 0, 0)
            if (!f) return -1;
            return f.lseek(0, SeekWhence.End)
        }

        /**
         * Read contents of file as a string.
         * @param filename the file name to append data, eg: "data.txt"
         */
        //% blockId=storageRead block="storage %source|read %filename|as string"
        //% weight=96
        read(filename: string): string {
            return __bufferToString(this.readAsBuffer(filename))
        }

        /** Read contents of file as a buffer. */
        //%
        readAsBuffer(filename: string): Buffer {
            let f = this.getFile(filename)
            let sz = f.lseek(0, SeekWhence.End)
            let b = output.createBuffer(sz)
            f.lseek(0, SeekWhence.Set);
            f.read(b)
            return b
        }

        /**
         * Resizing the size of a file to stay under the limit.
         * @param filename name of the file to drop, eg: "data.txt"
         * @param size maximum length
         */
        //% blockId=storageLimit block="storage %source|limit %filename|to %size|bytes"
        //% weight=100
        limit(filename: string, size: number) {
            if (!this.exists(filename) || size < 0) return;

            const sz = storage.temporary.size(filename);
            if (sz > size) {
                let buf = storage.temporary.readAsBuffer(filename)
                buf = buf.slice(buf.length / 2);
                storage.temporary.overwriteWithBuffer(filename, buf);
            }
        }
    }

    export function toCSV(data: number[], sep: string) {
        let s = ""
        for (const d of data) {
            if (s) s += sep;
            s = s + d;
        }
        s += "\r\n"
        return s;
    }

    /**
     * Set for CSV file separator. It is necessary to use depending on your regional settings of the application displaying CSV. By default, a comma is used.
     * @param sep separator character, eg: Separators.Comma
     */
    //% blockId=setCSVSeparator block="storage CSV set $sep|separator"
    //% weight=80
    export function setCSVSeparator(sep: Separators) {
        csvSeparator = separatorConverter(sep);
    }

    function separatorConverter(sep: Separators): string {
        if (sep == Separators.Semicolon) return ";";
        else return ",";
    }

    class TemporaryStorage extends Storage {
        constructor() {
            super();
        }

        protected mapFilename(filename: string) {
            if (filename[0] == '/') filename = filename.substr(1);
            return '/tmp/logs/' + filename;
        }
    }

    /**
     * Temporary storage in memory, deleted when the device restarts.
     */
    //% whenUsed fixedInstance block="temporary"
    export const temporary: Storage = new TemporaryStorage();

    class PermanentStorage extends Storage {
        constructor() {
            super()
        }

        protected mapFilename(filename: string) {
            if (filename[0] == '/') return filename;
            return '/' + filename;
        }
    }

    /**
     * Permanent storage on the brick, must be deleted with code.
     */
    //% whenUsed fixedInstance block="permanent"
    export const permanent: Storage = new PermanentStorage();
}