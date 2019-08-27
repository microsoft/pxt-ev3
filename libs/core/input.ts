namespace sensors.internal {
    //% shim=pxt::unsafePollForChanges
    export function unsafePollForChanges(
        periodMs: number,
        query: () => number,
        changeHandler: (prev: number, curr: number) => void
    ) {
        // This is implemented in C++ without blocking the regular JS when query() is runnning
        // which is generally unsafe. Query should not update globally visible state, and cannot
        // call any yielding functions, like sleep().

        // This is implementation for the simulator.

        control.runInParallel(() => {
            let prev = query()
            changeHandler(prev, prev)
            while (true) {
                pause(periodMs)
                let curr = query()
                if (prev !== curr) {
                    changeHandler(prev, curr)
                    prev = curr
                }
            }
        })
    }

    let analogMM: MMap
    let uartMM: MMap
    let devcon: Buffer
    let sensorInfos: SensorInfo[]

    class SensorInfo {
        port: number
        sensor: Sensor
        sensors: Sensor[]
        connType: number
        devType: number

        constructor(p: number) {
            this.port = p
            this.connType = DAL.CONN_NONE
            this.devType = DAL.DEVICE_TYPE_NONE
            this.sensors = []
        }
    }

    function init() {
        if (sensorInfos) return
        sensorInfos = []
        for (let i = 0; i < DAL.NUM_INPUTS; ++i) sensorInfos.push(new SensorInfo(i))
        devcon = output.createBuffer(DevConOff.Size)

        analogMM = control.mmap("/dev/lms_analog", AnalogOff.Size, 0)
        if (!analogMM) control.fail("no analog sensor")

        uartMM = control.mmap("/dev/lms_uart", UartOff.Size, 0)
        if (!uartMM) control.fail("no uart sensor")

        forever(() => {
            detectDevices()
            pause(500)
        })

        for (let info_ of sensorInfos) {
            let info = info_
            unsafePollForChanges(50, () => {
                if (info.sensor) return info.sensor._query()
                return 0
            }, (prev, curr) => {
                if (info.sensor) info.sensor._update(prev, curr)
            })
        }

    }

    export function getActiveSensors(): Sensor[] {
        init();
        return sensorInfos.filter(si => si.sensor && si.sensor.isActive()).map(si => si.sensor);
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

    export function getBatteryInfo(): { temp: number; current: number } {
        init();
        return {
            temp: analogMM.getNumber(NumberFormat.Int16LE, AnalogOff.BatteryTemp),
            current: Math.round(analogMM.getNumber(NumberFormat.Int16LE, AnalogOff.BatteryCurrent) / 10)
        }
    }

    function detectDevices() {
        let conns = analogMM.slice(AnalogOff.InConn, DAL.NUM_INPUTS)
        let numChanged = 0

        for (let info of sensorInfos) {
            let newConn = conns[info.port]
            if (newConn == info.connType)
                continue
            numChanged++
            info.connType = newConn
            info.devType = DAL.DEVICE_TYPE_NONE
            if (newConn == DAL.CONN_INPUT_UART) {
                control.dmesg(`new UART connection at ${info.port}`)
                setUartMode(info.port, 0)
                let uinfo = readUartInfo(info.port, 0)
                info.devType = uinfo[TypesOff.Type]
                control.dmesg(`UART type ${info.devType}`)
            } else if (newConn == DAL.CONN_INPUT_DUMB) {
                control.dmesg(`new DUMB connection at ${info.port}`)
                // TODO? for now assume touch
                info.devType = DAL.DEVICE_TYPE_TOUCH
            } else if (newConn == DAL.CONN_NONE || newConn == 0) {
                control.dmesg(`disconnect at ${info.port}`)
            } else {
                control.dmesg(`unknown connection type: ${newConn} at ${info.port}`)
            }
        }

        if (numChanged == 0)
            return

        for (let si of sensorInfos) {
            if (si.sensor && si.sensor._deviceType() != si.devType) {
                si.sensor = null
            }
            if (si.devType != DAL.DEVICE_TYPE_NONE) {
                // TODO figure out compiler problem when '|| null' is added here!
                si.sensor = si.sensors.filter(s => s._deviceType() == si.devType)[0]
                if (si.sensor == null) {
                    control.dmesg(`sensor not found for type=${si.devType} at ${si.port}`)
                } else {
                    control.dmesg(`sensor connected type=${si.devType} at ${si.port}`)
                    si.sensor._activated()
                }
            }
        }
    }

    export class Sensor extends control.Component {
        protected _port: number // this is 0-based

        constructor(port_: number) {
            super()
            if (!(1 <= port_ && port_ <= DAL.NUM_INPUTS))
                control.panic(120)
            this._port = port_ - 1
            init()
            sensorInfos[this._port].sensors.push(this)
            this.markUsed();
        }

        markUsed() {
            sensors.__sensorUsed(this._port, this._deviceType());
        }

        _activated() { }

        // 1-based
        port() {
            return this._port + 1
        }

        isActive() {
            return sensorInfos[this._port].sensor == this
        }

        _query() {
            return 0
        }

        _info(): string {
            return this._query().toString();
        }

        _update(prev: number, curr: number) {
        }

        _deviceType() {
            return 0
        }
    }

    export class AnalogSensor extends Sensor {
        constructor(port: number) {
            super(port)
        }

        _readPin6() {
            if (!this.isActive()) return 0
            return analogMM.getNumber(NumberFormat.Int16LE, AnalogOff.InPin6 + 2 * this._port)
        }
    }

    export class UartSensor extends Sensor {
        protected mode: number // the mode user asked for
        protected realmode: number // the mode the hardware is in

        constructor(port: number) {
            super(port)
            this.mode = 0
            this.realmode = 0
        }

        _activated() {
            this.realmode = 0
            this._setMode(this.mode)
        }

        protected _setMode(m: number) {
            //control.dmesg(`_setMode p=${this.port} m: ${this.realmode} -> ${m}`)
            let v = m | 0
            this.mode = v
            if (!this.isActive()) return
            if (this.realmode != this.mode) {
                this.realmode = v
                setUartMode(this._port, v)
            }
        }

        getBytes(): Buffer {
            return getUartBytes(this.isActive() ? this._port : -1)
        }

        getNumber(fmt: NumberFormat, off: number) {
            if (!this.isActive())
                return 0
            return getUartNumber(fmt, off, this._port)
        }

        reset() {
            if (this.isActive()) uartReset(this._port);
            this.realmode = 0;
        }
    }

    function uartReset(port: number) {
        if (port < 0) return
        control.dmesg(`UART reset at ${port}`)
        devcon.setNumber(NumberFormat.Int8LE, DevConOff.Connection + port, DAL.CONN_NONE)
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
            pause(25)
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

            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Connection + port, DAL.CONN_INPUT_UART)
            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Type + port, 0)
            devcon.setNumber(NumberFormat.Int8LE, DevConOff.Mode + port, 0)

            uartMM.ioctl(IO.UART_CLEAR_CHANGED, devcon)

            uartMM.setNumber(NumberFormat.Int8LE, UartOff.Status + port,
                getUartStatus(port) & 0xfffe)
            pause(10)
        }
    }

    function setUartMode(port: number, mode: number) {
        const UART_PORT_CHANGED = 1
        while (true) {
            if (port < 0) return
            control.dmesg(`UART set mode to ${mode} at ${port}`)
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
            pause(10)
        }
    }

    function getUartBytes(port: number): Buffer {
        if (port < 0) return output.createBuffer(DAL.MAX_DEVICE_DATALENGTH)
        let index = uartMM.getNumber(NumberFormat.UInt16LE, UartOff.Actual + port * 2)
        return uartMM.slice(
            UartOff.Raw + DAL.MAX_DEVICE_DATALENGTH * 300 * port + DAL.MAX_DEVICE_DATALENGTH * index,
            DAL.MAX_DEVICE_DATALENGTH)
    }

    function getUartNumber(fmt: NumberFormat, off: number, port: number) {
        if (port < 0) return 0
        let index = uartMM.getNumber(NumberFormat.UInt16LE, UartOff.Actual + port * 2)
        return uartMM.getNumber(fmt,
            UartOff.Raw + DAL.MAX_DEVICE_DATALENGTH * 300 * port + DAL.MAX_DEVICE_DATALENGTH * index + off)
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

namespace sensors {
    export enum ThresholdState {
        Normal = 1,
        High = 2,
        Low = 3,
    }

    export class ThresholdDetector {
        public id: number;
        public min: number;
        public max: number;
        public lowThreshold: number;
        public highThreshold: number;
        public level: number;
        public state: ThresholdState;

        constructor(id: number, min = 0, max = 100, lowThreshold = 20, highThreshold = 80) {
            this.id = id;
            this.min = min;
            this.max = max;
            this.lowThreshold = lowThreshold;
            this.highThreshold = highThreshold;
            this.level = Math.ceil((max - min) / 2);
            this.state = ThresholdState.Normal;
        }

        public setLevel(level: number) {
            if (this == null) return
            this.level = this.clampValue(level);

            if (this.level >= this.highThreshold) {
                this.setState(ThresholdState.High);
            }
            else if (this.level <= this.lowThreshold) {
                this.setState(ThresholdState.Low);
            }
            else {
                const interval = (this.highThreshold - this.lowThreshold) / 6;
                if ((this.state == ThresholdState.High && this.level < this.highThreshold - interval) ||
                    (this.state == ThresholdState.Low && this.level > this.lowThreshold + interval))
                    this.setState(ThresholdState.Normal);
            }
        }

        public threshold(t: ThresholdState): number {
            switch(t) {
                case ThresholdState.High: return this.highThreshold;
                case ThresholdState.Low: return this.lowThreshold;
                default: return (this.max - this.min) / 2;
            }
        }

        public setLowThreshold(value: number) {
            this.lowThreshold = this.clampValue(value);
            this.highThreshold = Math.max(this.lowThreshold + 1, this.highThreshold);
        }

        public setHighThreshold(value: number) {
            this.highThreshold = this.clampValue(value);
            this.lowThreshold = Math.min(this.highThreshold - 1, this.lowThreshold);
        }

        private clampValue(value: number) {
            if (value < this.min) {
                return this.min;
            }
            else if (value > this.max) {
                return this.max;
            }
            return value;
        }

        private setState(state: ThresholdState) {
            if (this.state == state) return;

            this.state = state;
            switch (state) {
                case ThresholdState.High:
                    control.raiseEvent(this.id, ThresholdState.High);
                    break;
                case ThresholdState.Low:
                    control.raiseEvent(this.id, ThresholdState.Low);
                    break;
            }
        }
    }    
}
