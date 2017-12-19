namespace pxsim {

    enum UartOff {
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

    enum UartStatus {
        UART_PORT_CHANGED = 1,
        UART_DATA_READY = 8
    }

    enum IO {
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


    enum DevConOff {
        Connection = 0, // int8[4]
        Type = 4, // int8[4]
        Mode = 8, // int8[4]
        Size = 12
    }

    enum UartCtlOff {
        TypeData = 0, // Types
        Port = 56, // int8
        Mode = 57, // int8
        Size = 58
    }

    enum TypesOff {
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

    export class EV3UArtState {

        constructor() {
            let data = new Uint8Array(UartOff.Size);
            MMapMethods.register("/dev/lms_uart", {
                data,
                beforeMemRead: () => {
                    //console.log("uart before read");
                    const inputNodes = ev3board().getInputNodes();
                    for (let port = 0; port < DAL.NUM_INPUTS; port++) {
                        const node = inputNodes[port];
                        if (node) {
                            // Actual
                            const index = 0; //UartOff.Actual + port * 2;
                            util.map16Bit(data, UartOff.Raw + DAL.MAX_DEVICE_DATALENGTH * 300 * port + DAL.MAX_DEVICE_DATALENGTH * index, Math.floor(node.getValue()))
                            // Status
                            data[UartOff.Status + port] = node.valueChange() ? UartStatus.UART_PORT_CHANGED : UartStatus.UART_DATA_READY;
                        }
                    }
                },
                read: buf => {
                    let v = "vSIM"
                    // for (let i = 0; i < buf.data.length; ++i)
                    //     buf.data[i] = v.charCodeAt(i) || 0
                    console.log("uart read");
                    console.log(buf.data);
                    return buf.data.length
                },
                write: buf => {
                    console.log("uart write");
                    console.log(buf);
                    return 2
                },
                ioctl: (id, buf) => {
                    switch (id) {
                        case IO.UART_SET_CONN: {
                            // Set mode
                            console.log("IO.UART_SET_CONN");
                            for (let port = 0; port < DAL.NUM_INPUTS; port++) {
                                const connection = buf.data[DevConOff.Connection + port]; // CONN_NONE, CONN_INPUT_UART
                                const type = buf.data[DevConOff.Type + port];
                                const mode = buf.data[DevConOff.Mode + port];
                                console.log(`${port}, mode: ${mode}`)
                                const node = ev3board().getInputNodes()[port];
                                if (node) node.setMode(mode);
                            }
                            return 2;
                        }
                        case IO.UART_CLEAR_CHANGED: {
                            console.log("IO.UART_CLEAR_CHANGED")
                            for (let port = 0; port < DAL.NUM_INPUTS; port++) {
                                const connection = buf.data[DevConOff.Connection + port]; // CONN_NONE, CONN_INPUT_UART
                                const type = buf.data[DevConOff.Type + port];
                                const mode = buf.data[DevConOff.Mode + port];
                                const node = ev3board().getInputNodes()[port];
                                if (node) node.setMode(mode);
                            }
                            return 2;
                        }
                        case IO.UART_READ_MODE_INFO: {
                            console.log("IO.UART_READ_MODE_INFO")
                            const port = buf.data[UartCtlOff.Port];
                            const mode = buf.data[UartCtlOff.Mode];
                            const node = ev3board().getInputNodes()[port];
                            if (node) buf.data[UartCtlOff.TypeData + TypesOff.Type] = node.getDeviceType(); // DEVICE_TYPE_NONE, DEVICE_TYPE_TOUCH, 
                            return 2;
                        }
                    }
                    console.log("uart ioctl");
                    console.log(id);
                    console.log(buf);
                    return 2;
                }
            })
        }
    }
}