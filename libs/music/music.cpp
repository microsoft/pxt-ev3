#include "pxt.h"
#include "ev3const.h"

#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <pthread.h>
#include <sys/mman.h>
#include <sys/ioctl.h>

#define NOTE_PAUSE 20

namespace music {

int _readSystemVolume() {
    char ParBuf[8];
    int volume;

    int fd = open("../sys/settings/Volume.rtf", O_RDONLY);
    read(fd, ParBuf, sizeof(ParBuf));
    close(fd);
    if (sscanf(ParBuf,"%d",&volume) > 0) {
        if ((volume >= 0) && (volume <= 100)) {
            return volume;
        }
    }
    return 50;
}

uint8_t currVolume = _readSystemVolume();
uint8_t *lmsSoundMMap;

int writeDev(void *data, int size) {
    int fd = open("/dev/lms_sound", O_WRONLY);
    int res = write(fd, data, size);
    close(fd);
    return res;
}

/**
* Set the output volume of the sound synthesizer.
* @param volume the volume 0...100, eg: 50
*/
//% weight=96
//% blockId=synth_set_volume block="set volume %volume"
//% parts="speaker" blockGap=8
//% volume.min=0 volume.max=100
//% help=music/set-volume
//% weight=1
//% group="Volume"
void setVolume(int volume) {
    currVolume = max(0, min(100, volume));
}

/**
* Return the output volume of the sound synthesizer.
*/
//% weight=96
//% blockId=synth_get_volume block="volume"
//% parts="speaker" blockGap=8
//% help=music/volume
//% weight=1
//% group="Volume"
int volume() {
    return currVolume;
}

#define SOUND_CMD_BREAK 0
#define SOUND_CMD_TONE 1
#define SOUND_CMD_PLAY 2
#define SOUND_CMD_REPEAT 3
#define SOUND_CMD_SERVICE 4

struct ToneCmd {
    uint8_t cmd;
    uint8_t lvl;
    uint16_t freq;
    uint16_t duration;
};

static void _stopSound() {
    uint8_t cmd = SOUND_CMD_BREAK;
    writeDev(&cmd, sizeof(cmd));
}

static uint8_t _getVolumeLevel(uint8_t volume, uint8_t levels) {
    uint8_t level;
    uint8_t step = (uint8_t) (100 / (levels - 1));
    if (volume < step) {
        level = 0;
    } else if (volume > step * (levels - 1)) {
        level = levels;
    } else {
        level = (uint8_t) (volume / step);
    }
    return level;
}

static void _playTone(uint16_t frequency, uint16_t duration, uint8_t volume) {
    // https://github.com/mindboards/ev3sources/blob/78ebaf5b6f8fe31cc17aa5dce0f8e4916a4fc072/lms2012/c_sound/source/c_sound.c#L471
    uint8_t level = _getVolumeLevel(volume, 13);

    ToneCmd cmd;
    cmd.cmd = SOUND_CMD_TONE;
    cmd.lvl = level;
    cmd.freq = frequency;
    cmd.duration = duration;
    //   (*SoundInstance.pSound).Busy = TRUE;
    writeDev(&cmd, sizeof(cmd));
}

static bool pumpMusicThreadRunning;
static pthread_mutex_t pumpMutex;
static Buffer currentSample;
static int samplePtr;
static pthread_cond_t sampleDone;

static void pumpMusic() {
    if (currentSample == NULL) {
        if (samplePtr > 0 && *lmsSoundMMap == 0) {
            samplePtr = 0;
            pthread_cond_broadcast(&sampleDone);
        }
        return;
    }

    uint8_t buf[250]; // max size supported by hardware
    buf[0] = SOUND_CMD_SERVICE;
    int len = min((int)sizeof(buf) - 1, currentSample->length - samplePtr);
    if (len == 0) {
        decrRC(currentSample);
        currentSample = NULL;
        return;
    }

    memcpy(buf + 1, currentSample->data + samplePtr, len);
    int rc = writeDev(buf, len + 1);
    if (rc > 0) {
        samplePtr += len;
    }
}

static void *pumpMusicThread(void *dummy) {
    while (true) {
        sleep_core_us(10000);
        pthread_mutex_lock(&pumpMutex);
        pumpMusic();
        pthread_mutex_unlock(&pumpMutex);
    }
}

void playSample(Buffer buf) {
    if (lmsSoundMMap == NULL) {
        int fd = open("/dev/lms_sound", O_RDWR);
        lmsSoundMMap = (uint8_t *)mmap(NULL, 1, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
        close(fd);
    }

    if (!pumpMusicThreadRunning) {
        pumpMusicThreadRunning = true;
        pthread_t pid;
        pthread_create(&pid, NULL, pumpMusicThread, NULL);
        pthread_detach(pid);
    }

    stopUser();
    pthread_mutex_lock(&pumpMutex);
    *lmsSoundMMap = 1; // BUSY
    // https://github.com/mindboards/ev3sources/blob/78ebaf5b6f8fe31cc17aa5dce0f8e4916a4fc072/lms2012/c_sound/source/c_sound.c#L605
    uint8_t cmd[] = {SOUND_CMD_PLAY, _getVolumeLevel(currVolume, 8)};
    writeDev(cmd, 2);
    decrRC(currentSample);
    currentSample = buf;
    incrRC(buf);
    samplePtr = 44; // WAV header is 44 bytes
    pumpMusic();
    pthread_cond_wait(&sampleDone, &pumpMutex);
    pthread_mutex_unlock(&pumpMutex);
    startUser();
}

/**
* Play a tone through the speaker for some amount of time.
* @param frequency pitch of the tone to play in Hertz (Hz), eg: Note.C
* @param ms tone duration in milliseconds (ms), eg: BeatFraction.Half
*/
//% help=music/play-tone
//% blockId=music_play_note block="play tone|at %note=device_note|for %duration=device_beat"
//% parts="headphone" async
//% blockNamespace=music
//% weight=76 blockGap=8
//% group="Tone"
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

/**
* Stop all sounds.
*/
//% help=music/stop-all-sounds
//% blockId=music_stop_all_sounds block="stop all sounds"
//% parts="headphone"
//% blockNamespace=music
//% weight=97
//% group="Volume"
void stopAllSounds() {
    if (currentSample) {
        samplePtr = currentSample->length;
    }
    _stopSound();
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

/** Play sound. */
//% promise
void play(Sound snd) {
    music::playSample(snd);
}
}
