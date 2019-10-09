namespace brick {
    /**
     * Stops the program. (in the simulator restarts it)
     */
    //% blockId=loopstop block="stop program"
    //% help=reference/brick/stop-program
    //% weight=10
    //% blockGap=8
    //% group="Power"
    export function stopProgram() {
        control.reset();
    }
}