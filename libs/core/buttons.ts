/**
 * User interaction on buttons
 */
const enum ButtonEvent {
    //% block="pressed"
    Pressed = 4,
    //% block="bumped"
    Bumped = 1,
    //% block="released"
    Released = 3,
}


namespace brick {
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

        protected poke() {

        }

        //% hidden
        _update(curr: boolean) {
            if (this == null) return
            if (this._isPressed == curr) return
            this._isPressed = curr
            if (curr) {
                this._wasPressed = true;
                this.downTime = control.millis()
                control.raiseEvent(this._id, ButtonEvent.Pressed)
            } else {
                control.raiseEvent(this._id, ButtonEvent.Released)
                const delta = control.millis() - this.downTime;
                if (delta < 500)
                    control.raiseEvent(this._id, ButtonEvent.Bumped)
            }
        }

        /**
         * Check if button is currently pressed or not.
         * @param button the button to query the request
         */
        //% help=brick/button/is-pressed
        //% block="%button|is pressed"
        //% blockId=buttonIsPressed
        //% parts="brick"
        //% blockNamespace=brick
        //% weight=81
        //% group="Buttons"
        //% button.fieldEditor="brickbuttons"
        isPressed() {
            this.poke();
            return this._isPressed
        }

        /**
         * See if the button was pressed again since the last time you checked.
         * @param button the button to query the request
         */
        //% help=brick/button/was-pressed
        //% block="%button|was pressed"
        //% blockId=buttonWasPressed
        //% blockHidden=true
        //% parts="brick"
        //% blockNamespace=brick
        //% weight=80
        //% group="Buttons"
        //% button.fieldEditor="brickbuttons"
        wasPressed() {
            this.poke();
            const r = this._wasPressed
            this._wasPressed = false
            return r
        }

        /**
         * Do something when a button or sensor is clicked, up or down.
         * @param button the button that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        //% help=brick/button/on-event
        //% blockId=buttonEvent block="on %button|%event"
        //% parts="brick"
        //% blockNamespace=brick
        //% weight=99 blockGap=16
        //% group="Buttons"
        //% button.fieldEditor="brickbuttons"
        onEvent(ev: ButtonEvent, body: () => void) {
            control.onEvent(this._id, ev, body)
        }

        /**
         * Waits until the event is raised
         * @param ev the event to wait for
         */
        //% help=brick/button/pause-until
        //% blockId=buttonWaitUntil block="pause until %button|%event"
        //% parts="brick"
        //% blockNamespace=brick
        //% weight=98 blockGap=8
        //% group="Buttons"
        //% button.fieldEditor="brickbuttons"
        pauseUntil(ev: ButtonEvent) {
            control.waitForEvent(this._id, ev);
        }
    }
}

namespace brick {
    let btnsMM: MMap
    let buttons: DevButton[]
    let buttonPoller: sensors.internal.Poller;

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
        buttonPoller = new sensors.internal.Poller(50, readButtons, (prev, curr) => {
            for (let b of buttons)
                b._update(!!(curr & b.mask))
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

        protected poke() {
            buttonPoller.poke();
        }
    }    

    initBtns() // always ON as it handles ESCAPE button


    /**
     * Enter button on the EV3 Brick.
     */
    //% whenUsed block="button enter" weight=95 fixedInstance
    export const buttonEnter: Button = new DevButton(DAL.BUTTON_ID_ENTER)

    /**
     * Left button on the EV3 Brick.
     */
    //% whenUsed block="button left" weight=95 fixedInstance
    export const buttonLeft: Button = new DevButton(DAL.BUTTON_ID_LEFT)

    /**
     * Right button on the EV3 Brick.
     */
    //% whenUsed block="button right" weight=94 fixedInstance
    export const buttonRight: Button = new DevButton(DAL.BUTTON_ID_RIGHT)

    /**
     * Up button on the EV3 Brick.
     */
    //% whenUsed block="button up" weight=95 fixedInstance
    export const buttonUp: Button = new DevButton(DAL.BUTTON_ID_UP)

    /**
     * Down button on the EV3 Brick.
     */
    //% whenUsed block="button down" weight=95 fixedInstance
    export const buttonDown: Button = new DevButton(DAL.BUTTON_ID_DOWN)
}


namespace control {
    /**
     * Determine the version of system software currently running.
     */
    //%
    export function deviceFirmwareVersion(): string {
        let buf = output.createBuffer(6)
        brick.internal.getBtnsMM().read(buf)
        let r = ""
        for (let i = 0; i < buf.length; ++i) {
            let c = buf[i]
            if (c == 0) break
            r += String.fromCharCode(c)
        }
        return r
    }
}