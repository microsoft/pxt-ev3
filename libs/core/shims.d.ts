// Auto-generated. Do not edit.
declare namespace control {

    /** Create new file mapping in memory */
    //% shim=control::mmap
    function mmap(filename: string, size: int32, offset: int32): MMap;
}


declare interface MMap {
    /**
     * Write a number in specified format in the buffer.
     */
    //% shim=MMapMethods::setNumber
    setNumber(format: NumberFormat, offset: int32, value: number): void;

    /**
     * Read a number in specified format from the buffer.
     */
    //% shim=MMapMethods::getNumber
    getNumber(format: NumberFormat, offset: int32): number;

    /**
     * Read a range of bytes into a buffer.
     */
    //% offset.defl=0 length.defl=-1 shim=MMapMethods::slice
    slice(offset?: int32, length?: int32): Buffer;

    /** Returns the length of a Buffer object. */
    //% property shim=MMapMethods::length
    length: int32;

    /** Perform ioctl(2) on the underlaying file */
    //% shim=MMapMethods::ioctl
    ioctl(id: uint32, data: Buffer): void;
}
declare namespace control {

    /**
     * Announce that an event happened to registered handlers.
     * @param src ID of the Component that generated the event
     * @param value Component specific code indicating the cause of the event.
     * @param mode optional definition of how the event should be processed after construction.
     */
    //% weight=21 blockGap=12 blockId="control_raise_event"
    //% block="raise event|from %src|with value value" blockExternalInputs=1 shim=control::raiseEvent
    function raiseEvent(src: int32, value: int32): void;

    /**
     * Allocates the next user notification event
     */
    //% help=control/allocate-notify-event shim=control::allocateNotifyEvent
    function allocateNotifyEvent(): int32;
}
declare namespace input {

    /**
     * Left button.
     */
    //% indexedInstanceNS=input indexedInstanceShim=pxt::getButton
    //% block="button left" weight=95 fixedInstance shim=pxt::getButton(0)
    const buttonLeft: Button;

    /**
     * Right button.
     */
    //% block="button right" weight=94 fixedInstance shim=pxt::getButton(1)
    const buttonRight: Button;

    /**
     * Up button.
     */
    //% block="button up" weight=95 fixedInstance shim=pxt::getButton(2)
    const buttonUp: Button;

    /**
     * Down button.
     */
    //% block="button down" weight=95 fixedInstance shim=pxt::getButton(3)
    const buttonDown: Button;

    /**
     * Enter button.
     */
    //% block="button enter" weight=95 fixedInstance shim=pxt::getButton(4)
    const buttonEnter: Button;
}
declare namespace control {

    /**
     * Determine the version of system software currently running.
     */
    //% shim=control::deviceFirmwareVersion
    function deviceFirmwareVersion(): string;
}
declare namespace output {

    /**
     * Set lights.
     */
    //% blockId=setLights block="set lights %pattern" shim=output::setLights
    function setLights(pattern: LightsPattern): void;
}



    //% fixedInstances
declare interface Button {
    /**
     * Do something when a button (`A`, `B` or both `A` + `B`) is clicked, double clicked, etc...
     * @param button the button that needs to be clicked or used
     * @param event the kind of button gesture that needs to be detected
     * @param body code to run when the event is raised
     */
    //% help=input/button/on-event weight=99 blockGap=8
    //% blockId=buttonEvent block="on %button|%event"
    //% parts="buttonpair"
    //% blockNamespace=input
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.width=220
    //% button.fieldOptions.columns=3 shim=ButtonMethods::onEvent
    onEvent(ev: ButtonEvent, body: () => void): void;

    /**
     * Check if a button is pressed or not.
     * @param button the button to query the request
     */
    //% help=input/button/is-pressed weight=79
    //% block="%button|is pressed"
    //% blockId=buttonIsPressed
    //% blockGap=8
    //% parts="buttonpair"
    //% blockNamespace=input
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.width=220
    //% button.fieldOptions.columns=3 shim=ButtonMethods::isPressed
    isPressed(): boolean;

    /**
     * See if the button was pressed again since the last time you checked.
     * @param button the button to query the request
     */
    //% help=input/button/was-pressed weight=78
    //% block="%button|was pressed"
    //% blockId=buttonWasPressed
    //% parts="buttonpair" blockGap=8
    //% blockNamespace=input advanced=true
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.width=220
    //% button.fieldOptions.columns=3 shim=ButtonMethods::wasPressed
    wasPressed(): boolean;
}
declare namespace screen {

    /** Draw text. */
    //% mode.defl=0 shim=screen::drawText
    function drawText(x: int32, y: int32, text: string, mode?: Draw): void;

    /** Clear screen and reset font to normal. */
    //% shim=screen::clear
    function clear(): void;

    /** Scroll screen vertically. */
    //% shim=screen::scroll
    function scroll(v: int32): void;

    /** Set font for drawText() */
    //% shim=screen::setFont
    function setFont(font: ScreenFont): void;
}
declare namespace output {

    /**
     * Create a new zero-initialized buffer.
     * @param size number of bytes in the buffer
     */
    //% shim=output::createBuffer
    function createBuffer(size: int32): Buffer;
}

// Auto-generated. Do not edit. Really.
