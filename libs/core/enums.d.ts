// Auto-generated. Do not edit.


    /**
     * User interaction on buttons
     */

    declare enum ButtonEvent {
    //% block="click"
    Click = 1,
    //% block="long click"
    LongClick = 2,
    //% block="up"
    Up = 3,
    //% block="down"
    Down = 4,
    }


    /**
     * Patterns for lights under the buttons.
     */

    declare enum LightsPattern {
    Off = 0,  // LED_BLACK
    Green = 1,  // LED_GREEN
    Red = 2,  // LED_RED
    Orange = 3,  // LED_ORANGE
    GreenFlash = 4,  // LED_GREEN_FLASH
    RedFlash = 5,  // LED_RED_FLASH
    OrangeFlash = 6,  // LED_ORANGE_FLASH
    GreenPulse = 7,  // LED_GREEN_PULSE
    RedPulse = 8,  // LED_RED_PULSE
    OrangePulse = 9,  // LED_ORANGE_PULSE
    }


    /**
     * Drawing modes
     */

    declare enum Draw {
    Normal = 0,
    Clear = (0x0004),  // DRAW_OPT_CLEAR_PIXELS
    Xor = (0x0018),  // DRAW_OPT_LOGICAL_XOR
    Fill = (0x0020),  // DRAW_OPT_FILL_SHAPE
    }


    declare enum ScreenFont {
    Normal = 0,  // FONTTYPE_NORMAL
    Small = 1,  // FONTTYPE_SMALL
    Large = 2,  // FONTTYPE_LARGE
    Tiny = 3,  // FONTTYPE_TINY
    }

// Auto-generated. Do not edit. Really.
