namespace input {

    //% shim=pxt::unsafePollForChanges
    function unsafePollForChanges(
        periodMs: int32,
        query: () => int32,
        changeHandler: (prev: int32, curr: int32) => void
    ) { }

    let analogMM: MMap

    /*
    struct_anon_76._fields_ = [
        ('InPin1', DATA16 * 4),
        ('InPin6', DATA16 * 4),
        ('OutPin5', DATA16 * 4),
        ('BatteryTemp', DATA16),
        ('MotorCurrent', DATA16),
        ('BatteryCurrent', DATA16),
        ('Cell123456', DATA16),
        ('Pin1', (DATA16 * 300) * 4),
        ('Pin6', (DATA16 * 300) * 4),
        ('Actual', UWORD * 4),
        ('LogIn', UWORD * 4),
        ('LogOut', UWORD * 4),
        ('NxtCol', COLORSTRUCT * 4),
        ('OutPin5Low', DATA16 * 4),
        ('Updated', DATA8 * 4),
        ('InDcm', DATA8 * 4),
        ('InConn', DATA8 * 4),
        ('OutDcm', DATA8 * 4),
        ('OutConn', DATA8 * 4),
    ]
    */

    function init() {
        if (analogMM) return
        analogMM = control.mmap("/dev/lms_analog", 1024, 0)
        if (!analogMM) control.fail("no analog sensor")
    }

    export class TouchSensor {
        port: number;
        id: number;
        private downTime: number;

        constructor(port: number) {
            this.port = port;
            this.id = 200 + port;
            init()
            unsafePollForChanges(50,
                () => this.isPressed() ? 1 : 0,
                (prev, curr) => {
                    if (prev == curr) return
                    if (curr) {
                        this.downTime = control.millis()
                        control.raiseEvent(this.id, ButtonEvent.Down)
                    } else {
                        control.raiseEvent(this.id, ButtonEvent.Up)
                        let delta = control.millis() - this.downTime
                        control.raiseEvent(this.id, delta > 500 ? ButtonEvent.LongClick : ButtonEvent.Click)
                    }
                })
        }

        isPressed() {
            return readAnalogPin6(this.port) > 2500
        }

        /**
         * Do something when a touch sensor is clicked, double clicked, etc...
         * @param button the button that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        onEvent(ev:ButtonEvent, body: () => void) {
            control.onEvent(this.id, ev, body)
        }
    }

    function readAnalogPin6(port: number) {
        init()
        port--
        port = Math.clamp(0, 3, port | 0)
        return analogMM.getNumber(NumberFormat.UInt16LE, 2 * (port + 4))
    }

}

namespace input {
    let uartMM: MMap

    /*
    DEVCON = [
    ('Connection', DATA8 * 4),
    ('Type', DATA8 * 4),
    ('Mode', DATA8 * 4),
    ]

    UART = [
    ('TypeData', (TYPES * 8) * 4),
    ('Repeat', (UWORD * 300) * 4),
    ('Raw', ((DATA8 * 32) * 300) * 4),
    ('Actual', UWORD * 4),
    ('LogIn', UWORD * 4),
    ('Status', DATA8 * 4),
    ('Output', (DATA8 * 32) * 4),
    ('OutputLength', DATA8 * 4),
    ]
    */

    function init() {
        if (uartMM) return
        uartMM = control.mmap("/dev/lms_uart", 1024, 0)
        if (!uartMM) control.fail("no uart sensor")
    }

    function setUartMode(port: number, mode: number) {

    }

}