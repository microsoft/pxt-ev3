namespace datalog {
    class EV3datalogStorage implements datalog.DatalogStorage {
        private _filename: string;
        private _buffer: string;
        private _storage: storage.Storage;

        constructor(storage: storage.Storage, filename: string) {
            this._filename = filename;
            this._storage = storage;
        }

        /**
         * Initializes the storage
         */
        init(): void {
            this._storage.remove(this._filename);
            this._buffer = "";
        }
        /**
         * Appends the headers in datalog
         */
        appendHeaders(headers: string[]): void {
            this._storage.appendCSVHeaders(this._filename, headers);
        }
        /**
         * Appends a row of data
         */
        appendRow(values: number[]): void {
            // commit row data
            this._buffer += storage.toCSV(values, this._storage.csvSeparator);
            // buffered writes
            if (this._buffer.length > 1024)
                this.flush();
        }
        /**
         * Flushes any buffered data
         */
        flush(): void {
            if (this._buffer) {
                const b = this._buffer;
                this._buffer = "";
                this._storage.append(this._filename, b);
            }    
        }
    }

    // hook up
    datalog.setStorage(new EV3datalogStorage(storage.temporary, "datalog.csv"));
}