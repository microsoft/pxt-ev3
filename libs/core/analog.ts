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

namespace core {
    let nextComponentId = 20000;

    export class Component {
        protected _id: number;
        constructor(id = 0) {
            if (!id) id = ++nextComponentId
            this._id = id
        }

        getId() {
            return this._id;
        }
    }
}

const enum LMS {
    NUM_INPUTS = 4,
    LCD_WIDTH = 178,
    LCD_HEIGHT = 128,

    DEVICE_TYPE_NXT_TOUCH = 1,
    DEVICE_TYPE_NXT_LIGHT = 2,
    DEVICE_TYPE_NXT_SOUND = 3,
    DEVICE_TYPE_NXT_COLOR = 4,
    DEVICE_TYPE_TACHO = 7,
    DEVICE_TYPE_MINITACHO = 8,
    DEVICE_TYPE_NEWTACHO = 9,
    DEVICE_TYPE_TOUCH = 16,
    DEVICE_TYPE_THIRD_PARTY_START = 50,
    DEVICE_TYPE_THIRD_PARTY_END = 99,
    DEVICE_TYPE_IIC_UNKNOWN = 100,
    DEVICE_TYPE_NXT_TEST = 101,
    DEVICE_TYPE_NXT_IIC = 123,
    DEVICE_TYPE_TERMINAL = 124,
    DEVICE_TYPE_UNKNOWN = 125,
    DEVICE_TYPE_NONE = 126,
    DEVICE_TYPE_ERROR = 127,
    MAX_DEVICE_DATALENGTH = 32,
    MAX_DEVICE_MODES = 8,
    UART_BUFFER_SIZE = 64,
    TYPE_NAME_LENGTH = 11,
    SYMBOL_LENGTH = 4,
    DEVICE_LOGBUF_SIZE = 300,
    IIC_NAME_LENGTH = 8,
    CONN_UNKNOWN = 111,
    CONN_DAISYCHAIN = 117,
    CONN_NXT_COLOR = 118,
    CONN_NXT_DUMB = 119,
    CONN_NXT_IIC = 120,
    CONN_INPUT_DUMB = 121,
    CONN_INPUT_UART = 122,
    CONN_OUTPUT_DUMB = 123,
    CONN_OUTPUT_INTELLIGENT = 124,
    CONN_OUTPUT_TACHO = 125,
    CONN_NONE = 126,
    CONN_ERROR = 127,
    opOutputGetType = 0xA0,
    opOutputSetType = 0xA1,
    opOutputReset = 0xA2,
    opOutputStop = 0xA3,
    opOutputPower = 0xA4,
    opOutputSpeed = 0xA5,
    opOutputStart = 0xA6,
    opOutputPolarity = 0xA7,
    opOutputRead = 0xA8,
    opOutputTest = 0xA9,
    opOutputReady = 0xAA,
    opOutputPosition = 0xAB,
    opOutputStepPower = 0xAC,
    opOutputTimePower = 0xAD,
    opOutputStepSpeed = 0xAE,
    opOutputTimeSpeed = 0xAF,
    opOutputStepSync = 0xB0,
    opOutputTimeSync = 0xB1,
    opOutputClearCount = 0xB2,
    opOutputGetCount = 0xB3,
    opOutputProgramStop = 0xB4,

    DEVICE_EVT_ANY = 0,
    DEVICE_ID_NOTIFY = 10000,
    DEVICE_ID_NOTIFY_ONE = 10001,
}

namespace inputint {
    //% shim=pxt::unsafePollForChanges
    function unsafePollForChanges(
        periodMs: int32,
        query: () => int32,
        changeHandler: (prev: int32, curr: int32) => void
    ) { }

    let analogMM: MMap
    let uartMM: MMap
    let devcon: Buffer
    let sensors: SensorInfo[]
    let autoSensors: Sensor[]

    class SensorInfo {
        port: number
        sensor: Sensor
        connType: number
        devType: number
        manual: boolean

        constructor(p: number) {
            this.port = p
            this.connType = LMS.CONN_NONE
            this.devType = LMS.DEVICE_TYPE_NONE
            this.sensor = null
            this.manual = false
        }
    }

    function init() {
        if (sensors) return
        sensors = []
        for (let i = 0; i < LMS.NUM_INPUTS; ++i) sensors.push(new SensorInfo(i))
        autoSensors = []
        devcon = output.createBuffer(DevConOff.Size)

        analogMM = control.mmap("/dev/lms_analog", AnalogOff.Size, 0)
        if (!analogMM) control.fail("no analog sensor")

        uartMM = control.mmap("/dev/lms_uart", UartOff.Size, 0)
        if (!uartMM) control.fail("no uart sensor")

        loops.forever(() => {
            detectDevices()
            loops.pause(500)
        })

        for (let info_ of sensors) {
            let info = info_
            unsafePollForChanges(50, () => {
                if (info.sensor) return info.sensor._query()
                return 0
            }, (prev, curr) => {
                if (info.sensor) info.sensor._update(prev, curr)
            })
        }

    }

    function readUartInfo(port: number, mode: number) {
        let buf = output.createBuffer(UartCtlOff.Size)
        buf[UartCtlOff.Port] = port
        buf[UartCtlOff.Mode] = mode
        uartMM.ioctl(IO.UART_READ_MODE_INFO, buf)
        return buf
        //let info = `t:${buf[TypesOff.Type]} c:${buf[TypesOff.Connection]} m:${buf[TypesOff.Mode]} n:${buf.slice(0, 12).toHex()}`
        //serial.writeLine("UART " + port + " / " + mode + " - " + info)
    }

    function detectDevices() {
        let conns = analogMM.slice(AnalogOff.InConn, LMS.NUM_INPUTS)
        let numChanged = 0

        for (let info of sensors) {
            let newConn = conns[info.port]
            if (newConn == info.connType)
                continue
            numChanged++
            info.connType = newConn
            info.devType = LMS.DEVICE_TYPE_NONE
            if (newConn == LMS.CONN_INPUT_UART) {
                setUartMode(info.port, 0)
                let uinfo = readUartInfo(info.port, 0)
                info.devType = uinfo[TypesOff.Type]
            } else if (newConn == LMS.CONN_INPUT_DUMB) {
                // TODO? for now assume touch
                info.devType = LMS.DEVICE_TYPE_TOUCH
            } else if (newConn == LMS.CONN_NONE) {
                // OK
            } else {
                // ???
            }
        }

        if (numChanged == 0)
            return

        let autos = sensors.filter(s => !s.manual)

        // first free up disconnected sensors
        for (let info of autos) {
            if (info.sensor && info.devType == LMS.DEVICE_TYPE_NONE)
                info.sensor._setPort(0)
        }

        for (let info of autos) {
            if (!info.sensor && info.devType != LMS.DEVICE_TYPE_NONE) {
                for (let s of autoSensors) {
                    if (s.getPort() == 0 && s._deviceType() == info.devType) {
                        s._setPort(info.port + 1)
                        break
                    }
                }
            }
        }
    }

    export class Sensor extends core.Component {
        protected port: number

        constructor() {
            super()
            init()
            this.port = -1
            let tp = this._deviceType()
            if (autoSensors.filter(s => s._deviceType() == tp).length == 0) {
                autoSensors.push(this)
            }
        }

        // 0 - disable, 1-4 port number
        _setPort(port: number, manual = false) {
            port = Math.clamp(0, 4, port | 0) - 1;
            if (port == this.port) return
            for (let i = 0; i < sensors.length; ++i) {
                if (i != this.port && sensors[i].sensor == this) {
                    sensors[i] = null
                    sensors[i].manual = false
                }
            }
            if (this.port > 0) {
                let prev = sensors[this.port].sensor
                if (prev && prev != this)
                    prev._setPort(0)
                sensors[this.port].sensor = this
                sensors[this.port].manual = manual
            }
            this._portUpdated()
        }

        protected _portUpdated() { }

        setPort(port: number) {
            this._setPort(port, true)
        }

        getPort() {
            return this.port + 1
        }

        isManual() {
            return this.port >= 0 && sensors[this.port].manual
        }

        _query() {
            return 0
        }

        _update(prev: number, curr: number) {
        }

        _deviceType() {
            return 0
        }
    }

    export class AnalogSensor extends Sensor {
        constructor() {
            super()
        }

        _readPin6() {
            if (this.port < 0) return 0
            return analogMM.getNumber(NumberFormat.Int16LE, AnalogOff.InPin6 + 2 * this.port)
        }
    }



    export class UartSensor extends Sensor {
        protected mode: number

        constructor() {
            super()
        }

        protected _portUpdated() {
            this.mode = -1
            if (this.port > 0) {
                if (this.isManual()) {
                    uartReset(this.port)
                } else {
                    this.mode = 0
                }
            }
        }

        protected _setMode(m: number) {
            if (this.port < 0) return
            let v = m | 0
            if (v != this.mode) {
                this.mode = v
                setUartMode(this.port, v)
            }
        }

        getBytes(): Buffer {
            return getUartBytes(this.port)
        }

        getNumber(fmt: NumberFormat, off: number) {
            return getUartNumber(fmt, off, this.port)
        }
    }

    function uartReset(port: number) {
        if (port < 0) return
        devcon.setNumber(NumberFormat.Int8LE, DevConOff.Connection + port, LMS.CONN_NONE)
        devcon.setNumber(NumberFormat.Int8LE, DevConOff.Type + port, 0)
        devcon.setNumber(NumberFormat.Int8LE, DevConOff.Mode + port, 0)
        uartMM.ioctl(IO.UART_SET_CONN, devcon)
    }

    function getUartStatus(port: number) {
        if (port < 0) return 0
        return uartMM.getNumber(NumberFormat.Int8LE, UartOff.Status + port)
    }

    function waitNonZeroUartStatus(port: number) {
        while (true) {
            if (port < 0) return 0
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
            if (port < 0) break

            if ((status & UART_DATA_READY) != 0 && (status & UART_PORT_CHANGED) == 0)
                break

            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Connection + port, LMS.CONN_INPUT_UART)
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
        while (true) {
            if (port < 0) return
            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Connection + port, LMS.CONN_INPUT_UART)
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
        if (port < 0) return output.createBuffer(LMS.MAX_DEVICE_DATALENGTH)
        let index = uartMM.getNumber(NumberFormat.UInt16LE, UartOff.Actual + port * 2)
        return uartMM.slice(
            UartOff.Raw + LMS.MAX_DEVICE_DATALENGTH * 300 * port + LMS.MAX_DEVICE_DATALENGTH * index,
            LMS.MAX_DEVICE_DATALENGTH)
    }

    function getUartNumber(fmt: NumberFormat, off: number, port: number) {
        if (port < 0) return 0
        let index = uartMM.getNumber(NumberFormat.UInt16LE, UartOff.Actual + port * 2)
        return uartMM.getNumber(fmt,
            UartOff.Raw + LMS.MAX_DEVICE_DATALENGTH * 300 * port + LMS.MAX_DEVICE_DATALENGTH * index + off)
    }


    const enum NxtColOff {
        Calibration = 0, // uint32[4][3]
        CalLimits = 48, // uint16[2]
        Crc = 52, // uint16
        ADRaw = 54, // uint16[4]
        SensorRaw = 62, // uint16[4]
        Padding = 70,
        Size = 72
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
        NxtCol = 4856, // uint16[36][4] - NxtColor*4
        OutPin5Low = 5144, // int16[4]
        Updated = 5152, // int8[4]
        InDcm = 5156, // int8[4]
        InConn = 5160, // int8[4]
        OutDcm = 5164, // int8[4]
        OutConn = 5168, // int8[4]
        Size = 5172
    }

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
}

namespace input {
    export class TouchSensor extends inputint.AnalogSensor {
        button: ButtonWrapper;

        constructor() {
            super()
            this.button = new ButtonWrapper()
        }

        _query() {
            return this._readPin6() > 2500 ? 1 : 0
        }

        _update(prev: number, curr: number) {
            this.button.update(curr > 0)
        }
    }

    export class ButtonWrapper extends core.Component {
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
         * Check if button is currently pressed.
         */
        isPressed() {
            return this._isPressed
        }

        /**
         * Check if button was pressed since last check.
         */
        wasPressed() {
            const r = this._wasPressed
            this._wasPressed = false
            return r
        }

        /**
         * Do something when a touch sensor is clicked, double clicked, etc...
         * @param button the button that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        onEvent(ev: ButtonEvent, body: () => void) {
            control.onEvent(this._id, ev, body)
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

    export class IrSensor extends inputint.UartSensor {
        private channel: IrRemoteChannel
        private pollRunning: boolean
        private buttons: ButtonWrapper[];

        constructor() {
            super()
            this.channel = IrRemoteChannel.Ch0
            this.buttons = []
            for (let i = 0; i < 5; ++i) {
                this.buttons.push(new ButtonWrapper())
            }
        }

        button(id: IrRemoteButton) {
            let num = -1
            while (id) {
                id >>= 1;
                num++;
            }
            num = Math.clamp(0, this.buttons.length - 1, num)
            return this.buttons[num]
        }

        _query() {
            if (this.mode == IrSensorMode.RemoteControl)
                return mapButton(this.getNumber(NumberFormat.UInt8LE, this.channel))
            return 0
        }

        _update(prev: number, curr: number) {
            for (let i = 0; i < this.buttons.length; ++i) {
                let v = !!(curr & (1 << i))
                this.buttons[i].update(v)
            }
        }

        setRemoteChannel(c: IrRemoteChannel) {
            c = Math.clamp(0, 3, c | 0)
            this.channel = c
            this.setMode(IrSensorMode.RemoteControl)
        }

        setMode(m: IrSensorMode) {
            this._setMode(m)
        }

        getDistance() {
            this.setMode(IrSensorMode.Proximity)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        getRemoteCommand() {
            this.setMode(IrSensorMode.RemoteControl)
            return this.getNumber(NumberFormat.UInt8LE, this.channel)
        }

        getDirectionAndDistance() {
            this.setMode(IrSensorMode.Seek)
            return this.getNumber(NumberFormat.UInt16LE, this.channel * 2)
        }
    }


    //% whenUsed
    export const touch: TouchSensor = new TouchSensor()
    //% whenUsed
    export const ir: IrSensor = new IrSensor()
}