
namespace pxsim.music {
    export function fromWAV(buf: RefBuffer) {
        return incr(buf)
    }

    export function stopAllSounds() {
        SoundMethods.stop()
    }
}

namespace pxsim.SoundMethods {
    let audio: HTMLAudioElement;

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
        if (!buf) {
            return Promise.resolve();
        }
        return new Promise<void>(resolve => {
            let url = "data:audio/wav;base64," + btoa(uint8ArrayToString(buf.data))
            audio = new Audio(url)
            audio.onended = () => resolve();
            audio.onpause = () => resolve();
            audio.play();
        })
    }

    export function stop() {
        return new Promise<void>(resolve => {
            if (audio) {
                audio.pause();
            }
            resolve();
        })
    }

}

