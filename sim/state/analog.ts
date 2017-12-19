namespace pxsim {

    enum AnalogOff {
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

    export class EV3AnalogState {

        constructor() {
            let data = new Uint8Array(5172)
            MMapMethods.register("/dev/lms_analog", {
                data,
                beforeMemRead: () => {
                    //console.log("analog before read");
                    const inputNodes = ev3board().getInputNodes();
                    for (let port = 0; port < DAL.NUM_INPUTS; port++) {
                        const node = inputNodes[port];
                        if (node) {
                            data[AnalogOff.InConn + port] = node.isUart() ? DAL.CONN_INPUT_UART : DAL.CONN_INPUT_DUMB;
                            if (node.isAnalog() && node.hasData()) {
                                //data[AnalogOff.InPin6 + 2 * port] = node.getValue();
                                util.map16Bit(data, AnalogOff.InPin6 + 2 * port, Math.floor(node.getValue()));
                            }
                        }
                    }
                },
                read: buf => {
                    let v = "vSIM"
                    for (let i = 0; i < buf.data.length; ++i)
                        buf.data[i] = v.charCodeAt(i) || 0
                    console.log("analog read");
                    console.log(buf.data);
                    return buf.data.length
                },
                write: buf => {
                    console.log("analog write");
                    console.log(buf);
                    return 2
                },
                ioctl: (id, buf) => {
                    console.log("analog ioctl");
                    console.log(id);
                    console.log(buf);
                    return 2;
                }
            })
        }
    }
}