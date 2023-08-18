//% color="#b0b0b0" weight=5 icon="\uf1c0"
namespace storage {
    // automatically send console output to temp storage
    storage.temporary.remove("console.txt");
    console.addListener(function(line) {
        const fn = "console.txt";
        const t = control.millis();
        storage.temporary.appendLine(fn, `${t}> ${line}`);
        storage.temporary.limit(fn, 65536);
    })    
}
