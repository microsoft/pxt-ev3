namespace storage {
    // automatically send console output to temp storage
    storage.temporary.remove("console.txt");
    console.addListener(function(line) {
        const fn = "console.txt";
        const mxs = 65536;
        const t = control.millis() / 1000;
        const sz = storage.temporary.size(fn);
        storage.temporary.appendLine(fn, `${t}> ${line}`);
        // shring by 50% if too big
        if (sz > 65536) {
            const buf = storage.temporary.readAsBuffer(fn);
            storage.temporary.overwriteWithBuffer(fn, buf.slice(buf.length / 2));
        }
    })    
}
