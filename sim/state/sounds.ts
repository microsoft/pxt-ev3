
namespace pxsim.music {
    export function fromWAV(buf: RefBuffer) {
        return incr(buf)
    }

    export function stopSounds() {
        SoundMethods.stop()
    }
}

namespace pxsim.SoundMethods {
    let numSoundsPlaying = 0;
    const soundsLimit = 1;
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
        if (!buf || numSoundsPlaying >= soundsLimit) {
            return Promise.resolve();
        }
        return new Promise<void>(resolve => {
            let url = "data:audio/wav;base64," + btoa(uint8ArrayToString(buf.data))
            audio = new Audio(url)
            audio.onended = () => {
                resolve();
                numSoundsPlaying--;
            }
            numSoundsPlaying++;
            audio.play()
        })
    }

    export function stop() {
        if (audio) {
            audio.pause();
        }
    }

}

