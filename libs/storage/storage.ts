namespace storage {
    // automatically send console output to temp storage
    storage.temporary.remove("console.txt");
    console.addListener(function(line) {
        const fn = "console.txt";
        const mxs = 65536;
        const t = control.millis();
        storage.temporary.appendLine(fn, `${t}> ${line}`);
        storage.temporary.limit(fn, 65536);
    })    
}