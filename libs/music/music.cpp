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

uint8_t currVolume = 2;
uint8_t *lmsSoundMMap;

int writeDev(void *data, int size) {
    int fd = open("/dev/lms_sound", O_WRONLY);
    int res = write(fd, data, size);
    close(fd);
    return res;
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

    pthread_mutex_lock(&pumpMutex);
    *lmsSoundMMap = 1; // BUSY
    uint8_t cmd[] = {SOUND_CMD_PLAY, (uint8_t)((currVolume / 33) + 1)};
    writeDev(cmd, 2);
    decrRC(currentSample);
    currentSample = buf;
    incrRC(buf);
    samplePtr = 44; // WAV header is 44 bytes
    pumpMusic();
    pthread_cond_wait(&sampleDone, &pumpMutex);
    pthread_mutex_unlock(&pumpMutex);
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

/** Play sound. */
//% promise
void play(Sound snd) {
    music::playSample(snd);
}
}