/// <reference no-default-lib="true"/>

/**
 * Reading and writing data to the console output.
 */
//% weight=12 color=#00451A icon="\uf112"
//% advanced=true
namespace console {
    type Listener = (text: string) => void;

    const listeners: Listener[] = [
        (text: string) => serial.writeLine(text)
    ];

    /**
     * Write a line of text to the console output.
     * @param value to send
     */
    //% weight=90
    //% help=console/log blockGap=8
    //% blockId=console_log block="console|log %text"
    export function log(text: string): void {
        for (let i = 0; i < listeners.length; ++i)
            listeners[i](text);
    }

    /**
     * Write a name:value pair as a line of text to the console output.
     * @param name name of the value stream, eg: "x"
     * @param value to write
     */
    //% weight=88 blockGap=8
    //% help=console/log-value
    //% blockId=console_log_value block="console|log value %name|= %value"
    export function logValue(name: string, value: number): void {
        log(`${name}: ${value}`)
    }

    /**
     * Adds a listener for the log messages
     * @param listener 
     */
    //%
    export function addListener(listener: (text: string) => void) {
        if (!listener) return;
        listeners.push(listener);
    }

    /**
     * Sends the log messages to the brick screen and uses the brick up and down buttons to scroll.
     */
    //% blockId=logsendtostreen block="send console to screen"
    //% weight=1
    export function sendToScreen(): void {
        console._screen.attach();
    }
}

namespace console._screen {
    const maxLines = 100;
    const screenLines = 10;
    let lines: string[];
    let scrollPosition = 0;

    export function attach() {
        if (!lines) {
            lines = [];
            console.addListener(log);
            brick.buttonUp.onEvent(ButtonEvent.Bumped, () => scroll(-3))
            brick.buttonDown.onEvent(ButtonEvent.Bumped, () => scroll(3))                
        }
    }

    function printLog() {
        brick.clearScreen()
        if (!lines) return;
        for (let i = 0; i < screenLines; ++i) {
            const line = lines[i + scrollPosition];
            if (line)
                screen.print(line, 0, 4 + i * brick.LINE_HEIGHT)
        }
    }

    function scroll(pos: number) {
        if (!pos) return;

        scrollPosition += pos >> 0;
        if (scrollPosition >= lines.length) scrollPosition = lines.length - 1;
        if (scrollPosition < 0) scrollPosition = 0;
        printLog();
    }

    function log(msg: string): void {    
        lines.push(msg);
        if (lines.length + 5 > maxLines) {
            lines.splice(0, maxLines - lines.length);
            scrollPosition = Math.min(scrollPosition, lines.length - 1)
        }
        // move down scroll once it gets large than the screen
        if (lines.length > screenLines
            && lines.length >= scrollPosition + screenLines) {
            scrollPosition++;
        }
        printLog();
    }
}