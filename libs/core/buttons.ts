
/**
 * Patterns for lights under the buttons.
 */
const enum LightsPattern {
    //% block=Off enumval=0
    //% blockIdentity=output.pattern
    Off = 0,
    //% block=Green enumval=1
    //% blockIdentity=output.pattern
    Green = 1,
    //% block=Red enumval=2
    //% blockIdentity=output.pattern
    Red = 2,
    //% block=Orange enumval=3
    //% blockIdentity=output.pattern
    Orange = 3,
    //% block="Flashing Green" enumval=4
    //% blockIdentity=output.pattern
    GreenFlash = 4,
    //% block="Flashing Red" enumval=5
    //% blockIdentity=output.pattern
    RedFlash = 5,
    //% block="Flashing Orange" enumval=6
    //% blockIdentity=output.pattern
    OrangeFlash = 6,
    //% block="Pulsing Green" enumval=7
    //% blockIdentity=output.pattern
    GreenPulse = 7,
    //% block="Pulsing Red" enumval=8
    //% blockIdentity=output.pattern
    RedPulse = 8,
    //% block="Pulsing Orange" enumval=9
    //% blockIdentity=output.pattern
    OrangePulse = 9,
}

/**
 * User interaction on buttons
 */
const enum ButtonEvent {
    //% block="click"
    Click = 1,
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
                control.raiseEvent(this._id, ButtonEvent.Click)
                //control.raiseEvent(this._id, delta > 500 ? ButtonEvent.LongClick : ButtonEvent.Click)
            }
        }

        /**
         * Check if button is currently pressed or not.
         * @param button the button to query the request
         */
        //% help=input/button/is-pressed
        //% block="%button|is pressed"
        //% blockId=buttonIsPressed
        //% parts="brick"
        //% blockNamespace=input
        //% weight=81 blockGap=8
        //% group="Brick"
        isPressed() {
            return this._isPressed
        }

        /**
         * See if the button was pressed again since the last time you checked.
         * @param button the button to query the request
         */
        //% help=input/button/was-pressed
        //% block="%button|was pressed"
        //% blockId=buttonWasPressed
        //% parts="brick"
        //% blockNamespace=input
        //% weight=80 blockGap=8
        //% group="Brick"
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
        //% help=input/button/on-event
        //% blockId=buttonEvent block="on %button|%event"
        //% parts="brick"
        //% blockNamespace=input
        //% weight=99 blockGap=8
        //% group="Brick"
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
        let sl = btnsMM.slice(0, DAL.NUM_BUTTONS)
        let ret = 0
        for (let i = 0; i < sl.length; ++i) {
            if (sl[i])
                ret |= 1 << i
        }
        return ret
    }

    function initBtns() {
        if (btnsMM) return
        btnsMM = control.mmap("/dev/lms_ui", DAL.NUM_BUTTONS, 0)
        if (!btnsMM) control.fail("no buttons?")
        buttons = []
        input.internal.unsafePollForChanges(50, readButtons, (prev, curr) => {
            if (curr & DAL.BUTTON_ID_ESCAPE)
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
     * Enter button on the EV3 Brick.
     */
    //% whenUsed block="brick button enter" weight=95 fixedInstance
    export const buttonEnter: Button = new DevButton(DAL.BUTTON_ID_ENTER)

    /**
     * Left button on the EV3 Brick.
     */
    //% whenUsed block="brick button left" weight=95 fixedInstance
    export const buttonLeft: Button = new DevButton(DAL.BUTTON_ID_LEFT)

    /**
     * Right button on the EV3 Brick.
     */
    //% whenUsed block="brick button right" weight=94 fixedInstance
    export const buttonRight: Button = new DevButton(DAL.BUTTON_ID_RIGHT)

    /**
     * Up button on the EV3 Brick.
     */
    //% whenUsed block="brick button up" weight=95 fixedInstance
    export const buttonUp: Button = new DevButton(DAL.BUTTON_ID_UP)

    /**
     * Down button on the EV3 Brick.
     */
    //% whenUsed block="brick button down" weight=95 fixedInstance
    export const buttonDown: Button = new DevButton(DAL.BUTTON_ID_DOWN)
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
     * @param pattern the lights pattern to use.
     */
    //% blockId=setLights block="set status light %pattern=led_pattern"
    //% weight=100 group="Brick"
    export function setStatusLight(pattern: number): void {
        if (currPattern === pattern)
            return
        currPattern = pattern
        let cmd = output.createBuffer(2)
        cmd[0] = pattern + 48
        input.internal.getBtnsMM().write(cmd)
    }


    /**
     * Pattern block.
     * @param pattern the lights pattern to use. eg: LightsPattern.Green
     */
    //% blockId=led_pattern block="%pattern"
    //% shim=TD_ID colorSecondary="#6e9a36"
    //% blockHidden=true useEnumVal=1 pattern.fieldOptions.decompileLiterals=1
    export function pattern(pattern: LightsPattern): number {
        return pattern;
    }
}
