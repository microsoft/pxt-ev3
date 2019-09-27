/**
 * Tagged image literal converter
 */
//% shim=@f4 helper=image::ofBuffer
//% groups=["0.,","1#*"]
function img(lits: any, ...args: any[]): Image { return null }

const screen = image.create(DAL.LCD_WIDTH, DAL.LCD_HEIGHT)

namespace _screen_internal {
    //% shim=pxt::updateScreen
    function updateScreen(img: Image): void { }
    //% shim=pxt::updateStats
    function updateStats(msg: string): void { }

    control.__screen.setupUpdate(() => updateScreen(screen))
    control.EventContext.onStats = function (msg: string) {
        updateStats(msg);
    }
}

namespace brick {
    const textOffset = 4;
    const lineOffset = 2;
    enum ScreenMode {
        None,
        ShowLines,
        Image,
        Ports,
        Custom
    }
    let screenMode = ScreenMode.None;
    export let font = image.font8;

    /**
     * Gets the text line height
     */
    //%
    export function lineHeight(): number {
        return font.charHeight + lineOffset;
    }

    /**
     * Number of lines
     */
    //%
    export function lineCount(): number {
        return ((screen.height - textOffset) / lineHeight()) >> 0
    }

    /**
     * Show text on the screen at a specific line.
     * @param text the text to print on the screen, eg: "Hello world"
     * @param line the line number to print the text at (starting at 1), eg: 1
     */
    //% blockId=screen_print block="show string %text|at line %line"
    //% weight=98 group="Screen" inlineInputMode="inline" blockGap=8
    //% help=brick/show-string
    //% line.min=1 line.max=10
    export function showString(text: string, line: number) {
        if (screenMode != ScreenMode.ShowLines) {
            screenMode = ScreenMode.ShowLines;
            screen.fill(0);
        }

        // line indexing starts at 1.
        line = (line - 1) >> 0;
        const nlines = lineCount();
        if (line < 0 || line > nlines) return; // out of screen

        const h = lineHeight();
        const y = textOffset + h * line;
        screen.fillRect(0, y, screen.width, h, 0); // clear background
        screen.print(text, textOffset, y, 1, font);
    }

    /**
     * Show a number on the screen
     * @param value the numeric value
     * @param line the line number to print the text at, eg: 1
     */
    //% blockId=screenShowNumber block="show number %name|at line %line"
    //% weight=96 group="Screen" inlineInputMode="inline" blockGap=8
    //% help=brick/show-number
    //% line.min=1 line.max=10
    export function showNumber(value: number, line: number) {
        showString("" + value, line);
    }

    /**
     * Show a name, value pair on the screen
     * @param value the numeric value
     * @param line the line number to print the text at, eg: 1
     */
    //% blockId=screenShowValue block="show value %name|= %text|at line %line"
    //% weight=96 group="Screen" inlineInputMode="inline" blockGap=8
    //% help=brick/show-value
    //% line.min=1 line.max=10
    export function showValue(name: string, value: number, line: number) {
        value = Math.round(value * 1000) / 1000;
        showString((name ? name + ": " : "") + value, line);
    }

    /**
     * Show an image on the screen
     * @param image image to draw
     * @param duration duration in milliseconds to display the image, eg: 400
     */
    //% blockId=screen_show_image block="show image %image=screen_image_picker"
    //% weight=100 group="Screen" blockGap=8
    //% help=brick/show-image
    export function showImage(image: Image, duration: number = 400) {
        if (!image) return;
        screenMode = ScreenMode.Image;
        screen.fill(0);
        screen.drawImage(image, 0, 0);
        if (duration > 0)
            pause(duration);
    }

    /**
    * Display the status of the sensors and motors attached to ports   
    */
    //% blockId=brickShowPorts block="show ports"
    //% help=brick/show-ports blockGap=8
    //% weight=10 group="Screen"
    export function showPorts() {
        if (screenMode == ScreenMode.Ports) return;

        screenMode = ScreenMode.Ports;
        renderPorts();
        control.runInParallel(function() {
            while(screenMode == ScreenMode.Ports) {
                renderPorts();
                pause(50);
            }
        })
    }

    function renderPorts() {
        const col = 44;
        const lineHeight8 = image.font8.charHeight + 2;
        clearScreen();

        function scale(x: number) {
            if (Math.abs(x) > 1000) return Math.round(x / 100) / 10 + "k";
            return ("" + (x >> 0));
        }

        // motors
        const datas = motors.getAllMotorData();
        for (let i = 0; i < datas.length; ++i) {
            const data = datas[i];
            if (!data.actualSpeed && !data.count) continue;
            const x = i * col;
            screen.print("ABCD"[i], x + 2, 1 * lineHeight8, 1, image.font8)
            screen.print(`${scale(data.actualSpeed)}%`, x + 2, 3 * lineHeight8, 1, image.font8)
            screen.print(`${scale(data.count)}>`, x + 2, 4 * lineHeight8, 1, image.font5)
        }
        screen.drawLine(0, 5 * lineHeight8, screen.width, 5 * lineHeight8, 1);

        // sensors
        const sis = sensors.internal.getActiveSensors();
        const h = screen.height;
        screen.drawLine(0, h - 5 * lineHeight8, screen.width, h - 5 * lineHeight8, 1)
        for (let i = 0; i < sis.length; ++i) {
            const si = sis[i];
            const x = (si.port() - 1) * col;
            const inf = si._info();
            screen.print(si.port() + "", x, h - 4 * lineHeight8, 1, image.font8)
            screen.print(inf, x, h - 2 * lineHeight8, 1, inf.length > 4 ? image.font5 : image.font8);
        }
    }

    /**
     * An image
     * @param image the image
     */
    //% blockId=screen_image_picker block="%image" shim=TD_ID
    //% image.fieldEditor="images"
    //% image.fieldOptions.columns=6
    //% image.fieldOptions.width=600
    //% group="Screen" weight=0 blockHidden=1
    export function __imagePicker(image: Image): Image {
        return image;
    }

    /**
     * Clear the screen
     */
    //% blockId=screen_clear_screen block="clear screen"
    //% weight=90 group="Screen"
    //% help=brick/clear-screen weight=1
    export function clearScreen() {
        screen.fill(0)
    }
}