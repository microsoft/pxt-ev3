
namespace pxsim.music {
    export function fromWAV(buf: RefBuffer) {
        return incr(buf)
    }
}

namespace pxsim.SoundMethods {

    export function buffer(buf: RefBuffer) {
        return incr(buf)
    }

    export function uint8ArrayToString(input: Uint8Array) {
        let len = input.length;
        let res = ""
        for (let i = 0; i < len; ++i)
            res += String.fromCharCode(input[i]);
        return res;
    }

    export function play(buf: RefBuffer, volume: number) {
        return new Promise<void>(resolve => {
            let url = "data:audio/wav;base64," + btoa(uint8ArrayToString(buf.data))
            let audio = new Audio(url)
            audio.onended = () => {
                resolve()
            }
            audio.play()
        })
    }
}

