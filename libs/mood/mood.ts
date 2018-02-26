namespace brick {
    /**
     * Show a mood on the brick's screen
     */
    //% weight=90
    //% blockId=moodShow block="show mood %mood=mood_image_picker"
    //% help=brick/show-mood
    //% weight=101 group="Screen" blockGap=8
    export function showMood(mood: Mood) {
        if(mood)
            mood.show();
    }

    /**
     * A mood
     */
    //% fixedInstances
    export class Mood {
        private image: Image;
        private sound: Sound;
        private light: StatusLight;

        constructor(image: Image, sound: Sound, light: StatusLight) {
            this.image = image;
            this.sound = sound;
            this.light = light;
        }

        /**
         * Shows the mood on the EV3
         */
        show() {
            brick.setStatusLight(this.light);
            brick.showImage(this.image);
            music.playSoundEffectUntilDone(this.sound);
            pause(20);
        }
    }

    /**
     * An image
     * @param image the image
     */
    //% blockId=mood_image_picker block="%image" shim=TD_ID
    //% image.fieldEditor="images"
    //% image.fieldOptions.columns=4
    //% image.fieldOptions.width=400
    //% group="Screen" weight=0 blockHidden=1
    export function __moodImagePicker(mood: Mood): Mood {
        return mood;
    }
}

namespace moods {
    /**
     * A sleeping mood
     */
    //% fixedInstance jres=images.eyesSleeping
    export const sleeping = new brick.Mood(images.eyesSleeping, sounds.expressionsSnoring, StatusLight.OrangePulse);

    /**
     * A awake mood
     */
    //% fixedInstance jres=images.eyesAwake
    export const awake = new brick.Mood(images.eyesAwake, sounds.informationActivate, StatusLight.Orange);

    /**
     * A tired mood
     */
    //% fixedInstance jres=images.eyesTiredMiddle
    export const tired = new brick.Mood(images.eyesTiredMiddle, sounds.expressionsSneezing, StatusLight.OrangeFlash);

    /**
     * An angry mood
     */
    //% fixedInstance jres=images.eyesAngry
    export const angry = new brick.Mood(images.eyesAngry, sounds.animalsDogGrowl, StatusLight.RedPulse);

    /**
     * A sad mood
     */
    //% fixedInstance jres=images.eyesTear
    export const sad = new brick.Mood(images.eyesTear, sounds.animalsDogWhine, StatusLight.Red);

    /**
     * A dizzy mood
     */
    //% fixedInstance jres=images.eyesDizzy
    export const dizzy = new brick.Mood(images.eyesDizzy, sounds.expressionsUhOh, StatusLight.OrangeFlash);

    /**
     * A knocked out mood
     */
    //% fixedInstance jres=images.eyesKnockedOut
    export const knockedOut = new brick.Mood(images.eyesKnockedOut, sounds.informationError, StatusLight.RedFlash);

    /**
     * Looking around left
     */
    //% fixedInstance jres=images.eyesMiddleLeft
    export const middleLeft = new brick.Mood(images.eyesMiddleLeft, sounds.informationAnalyze, StatusLight.Off);

    /**
     * Looking around right
     */
    //% fixedInstance jres=images.eyesMiddleRight
    export const middleRight = new brick.Mood(images.eyesMiddleRight, sounds.informationAnalyze, StatusLight.Off);

    /**
     * In love mood
     */
    //% fixedInstance jres=images.eyesLove
    export const love = new brick.Mood(images.eyesLove, sounds.expressionsMagicWand, StatusLight.GreenPulse);

    /**
     * In laughing mood
     */
    //% fixedInstance jres=images.eyesWinking
    export const winking = new brick.Mood(images.eyesWinking, sounds.expressionsLaughing1, StatusLight.GreenFlash);

    /**
     * In a neutral mood
     */
    //% fixedInstance jres=images.eyesNeutral
    export const neutral = new brick.Mood(images.eyesNeutral, undefined, StatusLight.Green);
}