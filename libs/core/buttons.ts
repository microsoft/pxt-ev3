
/**
 * Patterns for lights under the buttons.
 */
const enum LightsPattern {
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
 * User interaction on buttons
 */
const enum ButtonEvent {
    //% block="click"
    Click = 1,
    //% block="long click"
    LongClick = 2,
    //% block="up"
    Up = 3,
    //% block="down"
    Down = 4,
}

namespace input {
    /**
     * Generic button class, for device buttons and sensors.
     */
    //% fixedInstances
    export class Button extends control.Component {
        private downTime: number;
        private _isPressed: boolean;
        private _wasPressed: boolean;

        constructor() {
            super()
            this.downTime = 0
            this._isPressed = false
            this._wasPressed = false
        }

        //% hidden
        update(curr: boolean) {
            if (this._isPressed == curr) return
            this._isPressed = curr
            if (curr) {
                this.downTime = control.millis()
                control.raiseEvent(this._id, ButtonEvent.Down)
            } else {
                control.raiseEvent(this._id, ButtonEvent.Up)
                let delta = control.millis() - this.downTime
                control.raiseEvent(this._id, delta > 500 ? ButtonEvent.LongClick : ButtonEvent.Click)
            }
        }

        /**
         * Check if button is currently pressed or not.
         * @param button the button to query the request
         */
        //% help=input/button/is-pressed weight=79
        //% block="%button|is pressed"
        //% blockId=buttonIsPressed
        //% blockGap=8
        //% parts="buttonpair"
        //% blockNamespace=input
        //% button.fieldEditor="gridpicker"
        //% button.fieldOptions.width=220
        //% button.fieldOptions.columns=3
        isPressed() {
            return this._isPressed
        }

        /**
         * See if the button was pressed again since the last time you checked.
         * @param button the button to query the request
         */
        //% help=input/button/was-pressed weight=78
        //% block="%button|was pressed"
        //% blockId=buttonWasPressed
        //% parts="buttonpair" blockGap=8
        //% blockNamespace=input advanced=true
        //% button.fieldEditor="gridpicker"
        //% button.fieldOptions.width=220
        //% button.fieldOptions.columns=3
        wasPressed() {
            const r = this._wasPressed
            this._wasPressed = false
            return r
        }

        /**
         * Do something when a button or sensor is clicked, double clicked, etc...
         * @param button the button that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        //% help=input/button/on-event weight=99 blockGap=8
        //% blockId=buttonEvent block="on %button|%event"
        //% parts="buttonpair"
        //% blockNamespace=input
        //% button.fieldEditor="gridpicker"
        //% button.fieldOptions.width=220
        //% button.fieldOptions.columns=3
        onEvent(ev: ButtonEvent, body: () => void) {
            control.onEvent(this._id, ev, body)
        }
    }
}

namespace input {
    let btnsMM: MMap
    let buttons: DevButton[]

    export namespace internal {
        export function getBtnsMM() {
            initBtns()
            return btnsMM;
        }
    }

    function readButtons() {
        let sl = btnsMM.slice(0, LMS.NUM_BUTTONS)
        let ret = 0
        for (let i = 0; i < sl.length; ++i) {
            if (sl[i])
                ret |= 1 << i
        }
        return ret
    }

    function initBtns() {
        if (btnsMM) return
        btnsMM = control.mmap("/dev/lms_ui", LMS.NUM_BUTTONS, 0)
        if (!btnsMM) control.fail("no buttons?")
        buttons = []
        input.internal.unsafePollForChanges(50, readButtons, (prev, curr) => {
            if (curr & LMS.BUTTON_ID_ESCAPE)
                control.reset()
            for (let b of buttons)
                b.update(!!(curr & b.mask))
        })
        control.dmesg("runtime started, " + control.deviceFirmwareVersion())
    }

    class DevButton extends Button {
        mask: number
        constructor(mask: number) {
            super()
            this.mask = mask
            initBtns()
            buttons.push(this)
        }
    }

    initBtns() // always ON as it handles ESCAPE button

    /**
     * Left button.
     */
    //% whenUsed block="button left" weight=95 fixedInstance
    export const buttonLeft: Button = new DevButton(LMS.BUTTON_ID_LEFT)

    /**
     * Right button.
     */
    //% whenUsed block="button right" weight=94 fixedInstance
    export const buttonRight: Button = new DevButton(LMS.BUTTON_ID_RIGHT)

    /**
     * Up button.
     */
    //% whenUsed block="button up" weight=95 fixedInstance
    export const buttonUp: Button = new DevButton(LMS.BUTTON_ID_UP)

    /**
     * Down button.
     */
    //% whenUsed block="button down" weight=95 fixedInstance
    export const buttonDown: Button = new DevButton(LMS.BUTTON_ID_DOWN)

    /**
     * Enter button.
     */
    //% whenUsed block="button enter" weight=95 fixedInstance
    export const buttonEnter: Button = new DevButton(LMS.BUTTON_ID_ENTER)
}


namespace control {
    /**
     * Determine the version of system software currently running.
     */
    export function deviceFirmwareVersion(): string {
        let buf = output.createBuffer(6)
        input.internal.getBtnsMM().read(buf)
        let r = ""
        for (let i = 0; i < buf.length; ++i) {
            let c = buf[i]
            if (c == 0) break
            r += String.fromCharCode(c)
        }
        return r
    }
}

namespace output {
    let currPattern: LightsPattern

    /**
     * Set lights.
     */
    //% blockId=setLights block="set lights %pattern" 
    export function setLights(pattern: LightsPattern): void {
        if (currPattern === pattern)
            return
        currPattern = pattern
        let cmd = output.createBuffer(2)
        cmd[0] = pattern + 48
        input.internal.getBtnsMM().write(cmd)
    }
}
