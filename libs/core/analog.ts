namespace input {

    //% shim=pxt::unsafePollForChanges
    function unsafePollForChanges(
        periodMs: int32,
        query: () => int32,
        changeHandler: (prev: int32, curr: int32) => void
    ) { }

    let analogMM: MMap

    const enum NxtColOff {
        Calibration = 0, // uint32[4][3]
        CalLimits = 48, // uint16[2]
        Crc = 52, // uint16
        ADRaw = 54, // uint16[4]
        SensorRaw = 62, // uint16[4]
        Size = 70
    }
    const enum AnalogOff {
        InPin1 = 0, // int16[4]
        InPin6 = 8, // int16[4]
        OutPin5 = 16, // int16[4]
        BatteryTemp = 24, // int16
        MotorCurrent = 26, // int16
        BatteryCurrent = 28, // int16
        Cell123456 = 30, // int16
        Pin1 = 32, // int16[300][4]
        Pin6 = 2432, // int16[300][4]
        Actual = 4832, // uint16[4]
        LogIn = 4840, // uint16[4]
        LogOut = 4848, // uint16[4]
        NxtCol = 4856, // int16[35][4] - NxtCol * 4
        OutPin5Low = 5136, // int16[4]
        Updated = 5144, // int8[4]
        InDcm = 5148, // int8[4]
        InConn = 5152, // int8[4]
        OutDcm = 5156, // int8[4]
        OutConn = 5160, // int8[4]
        Size = 5164
    }

    function init() {
        if (analogMM) return
        analogMM = control.mmap("/dev/lms_analog", AnalogOff.Size, 0)
        if (!analogMM) control.fail("no analog sensor")
    }

    export class AnalogSensor {
        protected port: number
        protected id: number

        protected getPin6() {
            return readAnalogPin6(this.port)
        }

        constructor(port: number) {
            this.port = Math.clamp(1, 4, port | 0) - 1;
            this.id = 200 + port;
            init()
        }
    }

    export class TouchSensor extends AnalogSensor {
        private downTime: number;

        constructor(port: number) {
            super(port)
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
            return this.getPin6() > 2500
        }

        /**
         * Do something when a touch sensor is clicked, double clicked, etc...
         * @param button the button that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        onEvent(ev: ButtonEvent, body: () => void) {
            control.onEvent(this.id, ev, body)
        }
    }

    function readAnalogPin6(port: number) {
        init()
        port--
        port = Math.clamp(0, 3, port | 0)
        return analogMM.getNumber(NumberFormat.Int16LE, AnalogOff.InPin6 + 2 * port)
    }

}

const enum IrSensorMode {
    None = -1,
    Proximity = 0,
    Seek = 1,
    RemoteControl = 2,
}


const enum IrRemoteChannel {
    Ch0 = 0, // top
    Ch1 = 1,
    Ch2 = 2,
    Ch3 = 3,
}

const enum IrRemoteButton {
    None = 0x00,
    CenterBeacon = 0x01,
    TopLeft = 0x02,
    BottomLeft = 0x04,
    TopRight = 0x08,
    BottomRight = 0x10,
}

namespace input {
    let uartMM: MMap
    let devcon: Buffer

    const enum DevConOff {
        Connection = 0, // int8[4]
        Type = 4, // int8[4]
        Mode = 8, // int8[4]
        Size = 12
    }

    const enum TypesOff {
        Name = 0, // int8[12]
        Type = 12, // int8
        Connection = 13, // int8
        Mode = 14, // int8
        DataSets = 15, // int8
        Format = 16, // int8
        Figures = 17, // int8
        Decimals = 18, // int8
        Views = 19, // int8
        RawMin = 20, // float32
        RawMax = 24, // float32
        PctMin = 28, // float32
        PctMax = 32, // float32
        SiMin = 36, // float32
        SiMax = 40, // float32
        InvalidTime = 44, // uint16
        IdValue = 46, // uint16
        Pins = 48, // int8
        Symbol = 49, // int8[5]
        Align = 54, // uint16
        Size = 56
    }

    const enum UartOff {
        TypeData = 0, // Types[8][4]
        Repeat = 1792, // uint16[300][4]
        Raw = 4192, // int8[32][300][4]
        Actual = 42592, // uint16[4]
        LogIn = 42600, // uint16[4]
        Status = 42608, // int8[4]
        Output = 42612, // int8[32][4]
        OutputLength = 42740, // int8[4]
        Size = 42744
    }

    const enum UartCtlOff {
        TypeData = 0, // Types
        Port = 56, // int8
        Mode = 57, // int8
        Size = 58
    }

    const enum IO {
        UART_SET_CONN = 0xc00c7500,
        UART_READ_MODE_INFO = 0xc03c7501,
        UART_NACK_MODE_INFO = 0xc03c7502,
        UART_CLEAR_CHANGED = 0xc03c7503,
        IIC_SET_CONN = 0xc00c6902,
        IIC_READ_TYPE_INFO = 0xc03c6903,
        IIC_SETUP = 0xc04c6905,
        IIC_SET = 0xc02c6906,
        TST_PIN_ON = 0xc00b7401,
        TST_PIN_OFF = 0xc00b7402,
        TST_PIN_READ = 0xc00b7403,
        TST_PIN_WRITE = 0xc00b7404,
        TST_UART_ON = 0xc0487405,
        TST_UART_OFF = 0xc0487406,
        TST_UART_EN = 0xc0487407,
        TST_UART_DIS = 0xc0487408,
        TST_UART_READ = 0xc0487409,
        TST_UART_WRITE = 0xc048740a,
    }

    function init() {
        if (uartMM) return
        uartMM = control.mmap("/dev/lms_uart", UartOff.Size, 0)
        if (!uartMM) control.fail("no uart sensor")
        devcon = output.createBuffer(DevConOff.Size)
    }

    function uartReset(port: number) {
        port = Math.clamp(0, 3, port)
        devcon.setNumber(NumberFormat.Int8LE, DevConOff.Connection + port, DAL.CONN_NONE)
        devcon.setNumber(NumberFormat.Int8LE, DevConOff.Type + port, 0)
        devcon.setNumber(NumberFormat.Int8LE, DevConOff.Mode + port, 0)
        uartMM.ioctl(IO.UART_SET_CONN, devcon)
    }

    function getUartStatus(port: number) {
        return uartMM.getNumber(NumberFormat.Int8LE, UartOff.Status + port)
    }

    function waitNonZeroUartStatus(port: number) {
        while (true) {
            let s = getUartStatus(port)
            if (s) return s
            loops.pause(25)
        }
    }

    function uartClearChange(port: number) {
        const UART_DATA_READY = 8
        const UART_PORT_CHANGED = 1
        while (true) {
            let status = getUartStatus(port)

            if ((status & UART_DATA_READY) != 0 && (status & UART_PORT_CHANGED) == 0)
                break

            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Connection + port, DAL.CONN_INPUT_UART)
            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Type + port, 0)
            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Mode + port, 0)

            uartMM.ioctl(IO.UART_CLEAR_CHANGED, devcon)

            uartMM.setNumber(NumberFormat.Int8LE, UartOff.Status + port,
                getUartStatus(port) & 0xfffe)
            loops.pause(10)
        }
    }

    function setUartMode(port: number, mode: number) {
        const UART_PORT_CHANGED = 1
        port = Math.clamp(0, 3, port)
        loops.pause(100)
        while (true) {
            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Connection + port, DAL.CONN_INPUT_UART)
            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Type + port, 33)
            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Mode + port, mode)
            uartMM.ioctl(IO.UART_SET_CONN, devcon)
            let status = waitNonZeroUartStatus(port)
            if (status & UART_PORT_CHANGED) {
                uartClearChange(port)
            } else {
                break
            }
            loops.pause(10)
        }
    }

    function getUartBytes(port: number): Buffer {
        let index = uartMM.getNumber(NumberFormat.UInt16LE, UartOff.Actual + port * 2)
        let buf = output.createBuffer(32)
        for (let i = 0; i < 32; i += 4) {
            let v = uartMM.getNumber(NumberFormat.Int32LE, UartOff.Raw + 32 * 300 * port + 32 * index + i)
            buf.setNumber(NumberFormat.Int32LE, i, v)
        }
        return buf
    }

    function getUartNumber(fmt: NumberFormat, off: number, port: number) {
        let index = uartMM.getNumber(NumberFormat.UInt16LE, UartOff.Actual + port * 2)
        return uartMM.getNumber(fmt, UartOff.Raw + 32 * 300 * port + 32 * index + off)
    }


    export class UartSensor {
        port: number
        id: number

        constructor(port: number) {
            this.port = Math.clamp(1, 4, port | 0) - 1;
            this.id = 210 + port;
            init()
            uartReset(this.port)
        }
    }

    function mapButton(v: number) {
        switch (v) {
            case 0: return IrRemoteButton.None
            case 1: return IrRemoteButton.TopLeft
            case 2: return IrRemoteButton.BottomLeft
            case 3: return IrRemoteButton.TopRight
            case 4: return IrRemoteButton.TopRight | IrRemoteButton.BottomRight
            case 5: return IrRemoteButton.TopLeft | IrRemoteButton.TopRight
            case 6: return IrRemoteButton.TopLeft | IrRemoteButton.BottomRight
            case 7: return IrRemoteButton.BottomLeft | IrRemoteButton.TopRight
            case 8: return IrRemoteButton.BottomLeft | IrRemoteButton.BottomRight
            case 9: return IrRemoteButton.CenterBeacon
            case 10: return IrRemoteButton.BottomLeft | IrRemoteButton.TopLeft
            case 11: return IrRemoteButton.TopRight | IrRemoteButton.BottomRight
            default: return IrRemoteButton.None
        }
    }

    export class IrSensor extends UartSensor {
        private mode: IrSensorMode
        private channel: IrRemoteChannel
        private pollRunning: boolean

        constructor(port: number) {
            super(port)
            this.mode = IrSensorMode.None
            this.channel = IrRemoteChannel.Ch0
            this.pollRunning = false
        }

        setRemoteChannel(c: IrRemoteChannel) {
            c = Math.clamp(0, 3, c | 0)
            this.channel = c
            this.setMode(IrSensorMode.RemoteControl)
        }

        setMode(m: IrSensorMode) {
            let v = Math.clamp(0, 2, m | 0)
            if (v != this.mode) {
                this.mode = v
                setUartMode(this.port, v)
            }
        }

        getDistance() {
            this.setMode(IrSensorMode.Proximity)
            return getUartNumber(NumberFormat.UInt8LE, 0, this.port)
        }

        getRemoteCommand() {
            this.setMode(IrSensorMode.RemoteControl)
            let v = getUartNumber(NumberFormat.UInt8LE, this.channel, this.port)
            return v
        }

        getDirectionAndDistance() {
            this.setMode(IrSensorMode.Seek)
            return getUartNumber(NumberFormat.UInt16LE, this.channel * 2, this.port)
        }
    }


}