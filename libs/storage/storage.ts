namespace storage {
    // automatically send console output to temp storage
    console.addListener(function(line) {
        const fn = "console.txt";
        const mxs = 65536;
        const t = Math.round(control.millis() / 100000) * 100;
        const sz = storage.temporary.size(fn);
        storage.temporary.appendLine(fn, `${t}> ${line}`);
        // shring by 50% if too big
        if (sz > 65536) {
            const buf = storage.temporary.readAsBuffer(fn);
            storage.temporary.overwriteWithBuffer(fn, buf.slice(buf.length / 2));
        }
    })
}
