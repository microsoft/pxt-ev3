namespace pxsim.util {

    export function map16Bit(buffer: Uint8Array, index: number, value: number) {
        buffer[index] = (value >> 8) & 0xff;
        buffer[index+1] = value & 0xff;
    }
}