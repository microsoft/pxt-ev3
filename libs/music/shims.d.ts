// Auto-generated. Do not edit.
declare namespace music {

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
    //% group="Volume" shim=music::setVolume
    function setVolume(volume: int32): void;

    /**
     * Return the output volume of the sound synthesizer.
     */
    //% weight=96
    //% blockId=synth_get_volume block="volume"
    //% parts="speaker" blockGap=8
    //% help=music/volume
    //% weight=1
    //% group="Volume" shim=music::volume
    function volume(): int32;

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
    //% group="Tone" shim=music::playTone
    function playTone(frequency: int32, ms: int32): void;

    /**
     * Stop all sounds.
     */
    //% help=music/stop-all-sounds
    //% blockId=music_stop_all_sounds block="stop all sounds"
    //% parts="headphone"
    //% blockNamespace=music
    //% weight=97
    //% group="Volume" shim=music::stopAllSounds
    function stopAllSounds(): void;

    /** Makes a sound bound to a buffer in WAV format. */
    //% shim=music::fromWAV
    function fromWAV(buf: Buffer): Sound;
}



    //% fixedInstances
declare interface Sound {
    /** Returns the underlaying Buffer object. */
    //% property shim=SoundMethods::buffer
    buffer: Buffer;

    /** Play sound. */
    //% promise shim=SoundMethods::play
    play(): void;
}

// Auto-generated. Do not edit. Really.
