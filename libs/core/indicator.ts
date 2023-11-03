/**
 * Patterns for lights under the buttons.
 */
const enum StatusLight {
    //% block=off enumval=0
    Off = 0,
    //% block=green enumval=1
    Green = 1,
    //% block=red enumval=2
    Red = 2,
    //% block=orange enumval=3
    Orange = 3,
    //% block="green flash" enumval=4
    GreenFlash = 4,
    //% block="red flash" enumval=5
    RedFlash = 5,
    //% block="orange flash" enumval=6
    OrangeFlash = 6,
    //% block="green pulse" enumval=7
    GreenPulse = 7,
    //% block="red pulse" enumval=8
    RedPulse = 8,
    //% block="orange pulse" enumval=9
    OrangePulse = 9,
}

namespace brick {
    // the brick starts with the red color
    let currPattern: StatusLight = StatusLight.Off;

    /**
     * Gets the current light pattern.
     */
    //% weight=99 group="Indicator"
    //% help=brick/status-light
    export function statusLight() {
        return currPattern;
    }

    /**
     * Set lights.
     * @param pattern the lights pattern to use. eg: StatusLight.Orange
     */
    //% blockId=setLights block="set status light to %pattern"
    //% weight=100 group="Indicator"
    //% help=brick/set-status-light
    export function setStatusLight(pattern: StatusLight): void {
        if (currPattern === pattern)
            return
        currPattern = pattern;
        const cmd = output.createBuffer(2)
        cmd[0] = pattern + 48
        brick.internal.getBtnsMM().write(cmd)
    }
}
