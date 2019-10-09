namespace console {
    /**
     * Sends the log messages to the brick screen and uses the brick up and down buttons to scroll.
     */
    //% blockId=logsendtostreen block="send console to screen"
    //% weight=1
    //% help=console/send-to-screen
    export function sendToScreen(): void {
        console._screen.attach();
    }
}

namespace console._screen {
    const maxLines = 100;
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
        const screenLines = brick.lineCount();
        for (let i = 0; i < screenLines; ++i) {
            const line = lines[i + scrollPosition];
            if (line)
                screen.print(line, 0, 4 + i * brick.lineHeight(), 1, brick.font)
        }
    }

    function scroll(pos: number) {
        if (!pos) return;

        scrollPosition += pos >> 0;
        if (scrollPosition >= lines.length) scrollPosition = lines.length - 1;
        if (scrollPosition < 0) scrollPosition = 0;
        printLog();
    }

    function log(priority: ConsolePriority, msg: string): void {
        lines.push(msg);
        if (lines.length + 5 > maxLines) {
            lines.splice(0, maxLines - lines.length);
            scrollPosition = Math.min(scrollPosition, lines.length - 1)
        }
        // move down scroll once it gets large than the screen
        const screenLines = brick.lineCount();
        if (lines.length > screenLines
            && lines.length >= scrollPosition + screenLines) {
            scrollPosition++;
        }
        printLog();
    }
}