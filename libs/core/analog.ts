namespace input {
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

    export function readAnalogPin6(port: number) {
        init()
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