
/**
 * Patterns for lights under the buttons.
 */
const enum LightsPattern {
    //% block=Off enumval=0
    //% blockIdentity=brick.lightPattern
    Off = 0,
    //% block=Green enumval=1
    //% blockIdentity=brick.lightPattern
    Green = 1,
    //% block=Red enumval=2
    //% blockIdentity=brick.lightPattern
    Red = 2,
    //% block=Orange enumval=3
    //% blockIdentity=brick.lightPattern
    Orange = 3,
    //% block="Flashing Green" enumval=4
    //% blockIdentity=brick.lightPattern
    GreenFlash = 4,
    //% block="Flashing Red" enumval=5
    //% blockIdentity=brick.lightPattern
    RedFlash = 5,
    //% block="Flashing Orange" enumval=6
    //% blockIdentity=brick.lightPattern
    OrangeFlash = 6,
    //% block="Pulsing Green" enumval=7
    //% blockIdentity=brick.lightPattern
    GreenPulse = 7,
    //% block="Pulsing Red" enumval=8
    //% blockIdentity=brick.lightPattern
    RedPulse = 8,
    //% block="Pulsing Orange" enumval=9
    //% blockIdentity=brick.lightPattern
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

        //% hidden
        _update(curr: boolean) {
            if (this == null) return
            if (this._isPressed == curr) return
            this._isPressed = curr
            if (curr) {
                this._wasPressed = true;
                this.downTime = control.millis()
                control.raiseEvent(this._id, ButtonEvent.Down)
            } else {
                control.raiseEvent(this._id, ButtonEvent.Up)
                const delta = control.millis() - this.downTime;
                if (delta < 500)
                    control.raiseEvent(this._id, ButtonEvent.Click)
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
        //% blockNamespace=brick
        //% weight=81 blockGap=8
        //% group="Buttons"
        //% button.fieldEditor="brickbuttons"
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
        //% blockNamespace=brick
        //% weight=80
        //% group="Buttons"
        //% button.fieldEditor="brickbuttons"
        wasPressed() {
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
        //% help=input/button/on-event
        //% blockId=buttonEvent block="on %button|%event"
        //% parts="brick"
        //% blockNamespace=brick
        //% weight=99 blockGap=8
        //% group="Buttons"
        //% button.fieldEditor="brickbuttons"
        onEvent(ev: ButtonEvent, body: () => void) {
            control.onEvent(this._id, ev, body)
        }

        /**
         * Waits until the event is raised
         * @param ev the event to wait for
         */
        //% help=input/button/pause-until
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
        // this needs to be done in query(), which is run without the main JS execution mutex
        // otherwise, while(true){} will lock the device
        if (ret & DAL.BUTTON_ID_ESCAPE) {
            motors.stopAllMotors(); // ensuring that all motors are off
            control.reset()
        }
        return ret
    }

    function initBtns() {
        if (btnsMM) return
        btnsMM = control.mmap("/dev/lms_ui", DAL.NUM_BUTTONS, 0)
        if (!btnsMM) control.fail("no buttons?")
        buttons = []
        sensors.internal.unsafePollForChanges(50, readButtons, (prev, curr) => {
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

namespace brick {
    let currPattern: LightsPattern

    /**
     * Set lights.
     * @param pattern the lights pattern to use.
     */
    //% blockId=setLights block="set light to %pattern=led_pattern"
    //% weight=100 group="Buttons"
    export function setLight(pattern: number): void {
        if (currPattern === pattern)
            return
        currPattern = pattern
        let cmd = output.createBuffer(2)
        cmd[0] = pattern + 48
        brick.internal.getBtnsMM().write(cmd)
    }


    /**
     * Pattern block.
     * @param pattern the lights pattern to use. eg: LightsPattern.Green
     */
    //% blockId=led_pattern block="%pattern"
    //% shim=TD_ID colorSecondary="#6e9a36" group="Light"
    //% blockHidden=true useEnumVal=1 pattern.fieldOptions.decompileLiterals=1
    export function lightPattern(pattern: LightsPattern): number {
        return pattern;
    }
}
