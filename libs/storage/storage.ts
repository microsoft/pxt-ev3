namespace storage {
    // automatically send console output to temp storage
    storage.temporary.remove("console.txt");
    console.addListener(function(line) {
        const fn = "console.txt";
        const mxs = 65536;
        const t = control.millis();
        const sz = storage.temporary.size(fn);
        storage.temporary.appendLine(fn, `${t}> ${line}`);
        // shring by 50% if too big
        if (sz > 65536) {
            let buf = storage.temporary.readAsBuffer(fn);
            buf = buf.slice(buf.length / 2);
            // scan for \n and break after
            for(let i = 0; i < buf.length; ++i)
                if (buf[i] == 0x0a) {
                    buf = buf.slice(i + 1)
                    break;
                }
            storage.temporary.overwriteWithBuffer(fn, buf);
        }
    })    
}
