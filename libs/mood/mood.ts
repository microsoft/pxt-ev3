namespace brick {
    /**
     * A mood
     */
    //% fixedInstances
    export class Mood {
        image: Image;
        sound: Sound;
        light: BrickLight;

        constructor(image: Image, sound: Sound, light: BrickLight) {
            this.image = image;
            this.sound = sound;
            this.light = light;
        }

        /**
         * Shows the mood on the EV3
         */
        //% weight=90
        //% blockId=moodShow block="show mood %mood=mood_image_picker"
        //% weight=101 group="Screen" blockGap=8
        show() {
            brick.setLight(this.light);
            brick.showImage(this.image);
            if (this.sound)
                music.playSoundEffect(this.sound);
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
    export const sleeping = new brick.Mood(images.eyesSleeping, sounds.expressionsSnoring, BrickLight.OrangePulse);

    /**
     * A awake mood
     */
    //% fixedInstance jres=images.eyesAwake
    export const awake = new brick.Mood(images.eyesAwake, sounds.informationActivate, BrickLight.Orange);

    /**
     * A tired mood
     */
    //% fixedInstance jres=images.eyesTiredMiddle
    export const tired = new brick.Mood(images.eyesTiredMiddle, sounds.expressionsSneezing, BrickLight.OrangeFlash);
    
    /**
     * An angry mood
     */
    //% fixedInstance jres=images.eyesAngry
    export const angry = new brick.Mood(images.eyesAngry, sounds.animalsDogGrowl, BrickLight.RedPulse);

    /**
     * A sad mood
     */
    //% fixedInstance jres=images.eyesTear
    export const sad = new brick.Mood(images.eyesTear, sounds.animalsDogWhine, BrickLight.Red);

    /**
     * A dizzy mood
     */
    //% fixedInstance jres=images.eyesDizzy
    export const dizzy = new brick.Mood(images.eyesDizzy, sounds.expressionsUhOh, BrickLight.OrangeFlash);

    /**
     * A knocked out mood
     */
    //% fixedInstance jres=images.eyesKnockedOut
    export const knockedOut = new brick.Mood(images.eyesKnockedOut, sounds.informationError, BrickLight.RedFlash);
    
    /**
     * Looking around left
     */
    //% fixedInstance jres=images.eyesMiddleLeft
    export const middleLeft = new brick.Mood(images.eyesMiddleLeft, sounds.informationAnalyze, BrickLight.Off);    

    /**
     * Looking around right
     */
    //% fixedInstance jres=images.eyesMiddleRight
    export const middleRight = new brick.Mood(images.eyesMiddleRight, sounds.informationAnalyze, BrickLight.Off);    

    /**
     * In love mood
     */
    //% fixedInstance jres=images.eyesLove
    export const love = new brick.Mood(images.eyesLove, sounds.expressionsMagicWand, BrickLight.GreenPulse);    

    /**
     * In laughing mood
     */
    //% fixedInstance jres=images.eyesWinking
    export const winking = new brick.Mood(images.eyesWinking, sounds.expressionsLaughing1, BrickLight.GreenFlash);    

    /**
     * In a neutral mood
     */
    //% fixedInstance jres=images.eyesNeutral
    export const neutral = new brick.Mood(images.eyesNeutral, undefined, BrickLight.Green);
}