#include "pxt.h"
#include "ev3const.h"

#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

#define NOTE_PAUSE 20

namespace music {

uint8_t currVolume = 2;

void writeDev(void *data, int size) {
    int fd = open("/dev/lms_sound", O_WRONLY);
    write(fd, data, size);
    close(fd);
}

/**
* Set the output volume of the sound synthesizer.
* @param volume the volume 0...256, eg: 128
*/
//% weight=96
//% blockId=synth_set_volume block="set volume %volume"
//% parts="speaker" blockGap=8
//% volume.min=0 volume.max=256
//% help=music/set-volume
//% weight=1
void setVolume(int volume) {
    currVolume = max(0, min(100, volume * 100 / 256));
}

#define SOUND_CMD_BREAK 0
#define SOUND_CMD_TONE 1
#define SOUND_CMD_PLAY 2
#define SOUND_CMD_REPEAT 3
#define SOUND_CMD_SERVICE 4

struct ToneCmd {
    uint8_t cmd;
    uint8_t vol;
    uint16_t freq;
    uint16_t duration;
};

static void _stopSound() {
    uint8_t cmd = SOUND_CMD_BREAK;
    writeDev(&cmd, sizeof(cmd));
}

static void _playTone(uint16_t frequency, uint16_t duration, uint8_t volume) {
    ToneCmd cmd;
    cmd.cmd = SOUND_CMD_TONE;
    cmd.vol = volume;
    cmd.freq = frequency;
    cmd.duration = duration;
    //   (*SoundInstance.pSound).Busy = TRUE;
    writeDev(&cmd, sizeof(cmd));
}

/**
* Play a tone through the speaker for some amount of time.
* @param frequency pitch of the tone to play in Hertz (Hz)
* @param ms tone duration in milliseconds (ms)
*/
//% help=music/play-tone
//% blockId=music_play_note block="play tone|at %note=device_note|for %duration=device_beat"
//% parts="headphone" async
//% blockNamespace=music
//% weight=76 blockGap=8
void playTone(int frequency, int ms) {
    if (frequency <= 0) {
        _stopSound();
        if (ms >= 0)
            sleep_ms(ms);
    } else {
        if (ms > 0) {
            int d = max(1, ms - NOTE_PAUSE); // allow for short rest
            int r = max(1, ms - d);
            _playTone(frequency, d, currVolume);
            sleep_ms(d + r);
        } else {
            // ring
            _playTone(frequency, 0, currVolume);
        }
    }
    sleep_ms(1);
}


/** Makes a sound bound to a buffer in WAV format. */
//%
Sound fromWAV(Buffer buf) {
    incrRC(buf);
    return buf;
}

}

//% fixedInstances
namespace SoundMethods {

/** Returns the underlaying Buffer object. */
//% property
Buffer buffer(Sound snd) {
    incrRC(snd);
    return snd;
}

/** Play sound with given volume. */
//% promise
void play(Sound snd, int volume) {
    // TODO
}

}