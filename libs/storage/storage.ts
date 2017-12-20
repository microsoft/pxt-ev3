namespace storage {
    /** Append a CSV line to a file. */
    export function appendCSV(filename: string, data: number[]) {
        let s = ""
        for (let d of data) {
            if (s) s += ","
            s = s + d
        }
        s += "\n"
        append(filename, s)
    }
}
