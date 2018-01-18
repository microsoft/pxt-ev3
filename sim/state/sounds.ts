
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

    export function play(buf: RefBuffer) {
        return pxsim.AudioContextManager.playBufferAsync(buf);
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

