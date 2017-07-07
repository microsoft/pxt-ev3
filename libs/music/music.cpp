#include "pxt.h"
#include "ev3.h"

#define NOTE_PAUSE 20

namespace music {

byte currVolume = 100;

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

/**
* Play a tone through the speaker for some amount of time.
* @param frequency pitch of the tone to play in Hertz (Hz)
* @param ms tone duration in milliseconds (ms)
*/
//% help=music/play-tone weight=90
//% blockId=music_play_note block="play tone|at %note=device_note|for %duration=device_beat"
//% parts="headphone" async blockGap=8
//% blockNamespace=music
void playTone(int frequency, int ms) {
    if (frequency <= 0) {
        StopSound();
        if (ms >= 0)
            sleep_ms(ms);
    } else {
        if (ms > 0) {
            int d = max(1, ms - NOTE_PAUSE); // allow for short rest
            int r = max(1, ms - d);
            PlayToneEx(frequency, d, currVolume);
            sleep_ms(d + r);
        } else {
            // ring
            PlayToneEx(frequency, 60000, currVolume);
        }
    }
    sleep_ms(1);
}

}