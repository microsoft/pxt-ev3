
# Print Ports

```typescript
/**
 * Print the port states on the screen
 */
//% blockId=brickPrintPorts block="print ports"
//% help=brick/print-ports
//% weight=1 group="Screen"
function printPorts() {
    const col = 44;
    clearScreen();

    function scale(x: number) {
        if (Math.abs(x) > 1000) return Math.round(x / 100) / 10 + "k";
        return ("" + (x >> 0));
    }

    // motors
    const datas = motors.getAllMotorData();
    for(let i = 0; i < datas.length; ++i) {
        const data = datas[i];
        if (!data.actualSpeed && !data.count) continue;
        const x = i * col;
        print(`${scale(data.actualSpeed)}%`, x, brick.LINE_HEIGHT)
        print(`${scale(data.count)}>`, x, 2 * brick.LINE_HEIGHT)
        print(`${scale(data.tachoCount)}|`, x, 3 * brick.LINE_HEIGHT)
    }

    // sensors
    const sis = sensors.internal.getActiveSensors();
    for(let i =0; i < sis.length; ++i) {
        const si = sis[i];
        const x = (si.port() - 1) * col;
        const v = si._query();
        print(`${scale(v)}`, x, 9 * brick.LINE_HEIGHT)
    }
}
```