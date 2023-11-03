namespace brick {
    /**
     * Exits the program to the main menu. (in the simulator restarts it)
     */
    //% blockId=loopstop block="exit program"
    //% help=reference/brick/exit-program
    //% weight=10
    //% blockGap=8
    //% group="Program"
    export function exitProgram() {
        control.reset();
    }
}