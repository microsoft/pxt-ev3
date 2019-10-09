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

    /** Set pointer on the underlaying file. */
    //% shim=MMapMethods::lseek
    lseek(offset: int32, whence: SeekWhence): int32;
}
declare namespace control {

    /**
     * Announce that an event happened to registered handlers.
     * @param src ID of the Component that generated the event
     * @param value Component specific code indicating the cause of the event.
     * @param mode optional definition of how the event should be processed after construction.
     */
    //% weight=21 blockGap=12 blockId="control_raise_event"
    //% block="raise event|from %src|with value %value" blockExternalInputs=1
    //% help=control/raise-event shim=control::raiseEvent
    function raiseEvent(src: int32, value: int32): void;

    /**
     * Allocates the next user notification event
     */
    //% help=control/allocate-notify-event shim=control::allocateNotifyEvent
    function allocateNotifyEvent(): int32;

    /** Write data to DMESG debugging buffer. */
    //% shim=control::dmesg
    function dmesg(s: string): void;

    /**
     * Determines if the USB has been enumerated.
     */
    //% shim=control::isUSBInitialized
    function isUSBInitialized(): boolean;
}
declare namespace serial {

    /** Send DMESG debug buffer over serial. */
    //% shim=serial::writeDmesg
    function writeDmesg(): void;
}
declare namespace output {

    /**
     * Create a new zero-initialized buffer.
     * @param size number of bytes in the buffer
     */
    //% shim=output::createBuffer
    function createBuffer(size: int32): Buffer;
}
declare namespace motors {

    /**
     *  Mark a motor as used
     */
    //% shim=motors::__motorUsed
    function __motorUsed(port: int32, large: boolean): void;
}
declare namespace sensors {

    /**
     *  Mark a sensor as used
     */
    //% shim=sensors::__sensorUsed
    function __sensorUsed(port: int32, type: int32): void;
}

// Auto-generated. Do not edit. Really.
