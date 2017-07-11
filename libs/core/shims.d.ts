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
    ioctl(id: uint32, data: Buffer): int32;

    /** Perform write(2) on the underlaying file */
    //% shim=MMapMethods::write
    write(data: Buffer): int32;

    /** Perform read(2) on the underlaying file */
    //% shim=MMapMethods::read
    read(data: Buffer): int32;
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

    /** Write data to DMESG debugging buffer. */
    //% shim=control::dmesg
    function dmesg(s: string): void;
}
declare namespace serial {

    /** Send DMESG debug buffer over serial. */
    //% shim=serial::writeDmesg
    function writeDmesg(): void;
}
declare namespace screen {

    /** Double size of an icon. */
    //% shim=screen::doubleIcon
    function doubleIcon(buf: Buffer): Buffer;

    /** Draw an icon on the screen. */
    //% shim=screen::drawIcon
    function drawIcon(x: int32, y: int32, buf: Buffer, mode: Draw): void;

    /** Clear screen and reset font to normal. */
    //% shim=screen::clear
    function clear(): void;
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
