namespace input.internal {
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
                control.dmesg(`new UART connection at ${info.port}`)
                setUartMode(info.port, 0)
                let uinfo = readUartInfo(info.port, 0)
                info.devType = uinfo[TypesOff.Type]
                control.dmesg(`UART type ${info.devType}`)
            } else if (newConn == LMS.CONN_INPUT_DUMB) {
                control.dmesg(`new DUMB connection at ${info.port}`)
                // TODO? for now assume touch
                info.devType = LMS.DEVICE_TYPE_TOUCH
            } else if (newConn == LMS.CONN_NONE || newConn == 0) {
                control.dmesg(`disconnect at ${info.port}`)
            } else {
                control.dmesg(`unknown connection type: ${newConn} at ${info.port}`)
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
                let found = false
                for (let s of autoSensors) {
                    if (s.getPort() == 0 && s._deviceType() == info.devType) {
                        s._setPort(info.port + 1)
                        found = true
                        break
                    }
                }
                if (!found)
                    control.dmesg(`sensor not found for type=${info.devType} at ${info.port}`)
            }
        }
    }

    export class Sensor extends control.Component {
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
            this.port = port
            control.dmesg(`sensor set port ${port} on devtype=${this._deviceType()}`)
            for (let i = 0; i < sensors.length; ++i) {
                if (i != this.port && sensors[i].sensor == this) {
                    sensors[i].sensor = null
                    sensors[i].manual = false
                }
            }
            if (this.port >= 0) {
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
        protected realmode: number

        constructor() {
            super()
            this.mode = 0
            this.realmode = -1
        }

        protected _portUpdated() {
            this.realmode = -1
            if (this.port >= 0) {
                if (this.isManual()) {
                    uartReset(this.port)
                } else {
                    this.realmode = 0
                }
                this._setMode(this.mode)
            }
        }

        protected _setMode(m: number) {
            //control.dmesg(`_setMode p=${this.port} m: ${this.realmode} -> ${m}`)
            let v = m | 0
            this.mode = v
            if (this.port < 0) return
            if (this.realmode != this.mode) {
                this.realmode = v
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
        control.dmesg(`UART reset at ${port}`)
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
            control.dmesg(`UART set mode to ${mode} at ${port}`)
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
    export class ButtonTS extends control.Component {
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
}
