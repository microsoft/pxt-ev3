
namespace pxsim.music {
    export function fromWAV(buf: RefBuffer) {
        return buf
    }

    export function stopAllSounds() {
        SoundMethods.stop()
    }

    pxsim.music.setVolume = (volume: number): void => {
        pxsim.getAudioState().volume = volume;
    };

    export function volume() {
        return pxsim.getAudioState().volume;
    }
}

namespace pxsim.SoundMethods {
    let audio: HTMLAudioElement;

    export function buffer(buf: RefBuffer) {
        return buf
    }

    export function play(buf: RefBuffer) {
        return pxsim.AudioContextManager.playBufferAsync(buf);
    }

    export function stop() {
        pxsim.AudioContextManager.stop();
    }

}

