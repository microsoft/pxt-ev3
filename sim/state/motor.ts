namespace pxsim {

    enum MotorDataOff {
        TachoCounts = 0, // int32
        Speed = 4, // int8
        Padding = 5, // int8[3]
        TachoSensor = 8, // int32
        Size = 12
    }

    export class EV3MotorState {

        constructor() {
            let data = new Uint8Array(12 * DAL.NUM_OUTPUTS)
            MMapMethods.register("/dev/lms_motor", {
                data,
                beforeMemRead: () => {
                    const outputs = ev3board().outputNodes;
                    // console.log("motor before read");
                    for (let port = 0; port < DAL.NUM_OUTPUTS; ++port) {
                        const output = outputs[port];
                        const speed = output ? outputs[port].getSpeed() : 0;
                        const angle = output ? outputs[port].getAngle() : 0;
                        const tci = MotorDataOff.TachoCounts + port * MotorDataOff.Size;
                        const tsi = MotorDataOff.TachoSensor + port * MotorDataOff.Size;
                        data[tci] = data[tci + 1] = data[tci + 2] = data[tci + 3] = 0; // Tacho count
                        data[MotorDataOff.Speed + port * MotorDataOff.Size] = speed; // Speed
                        data[tsi] = angle & 0xff; // Count
                        data[tsi + 1] = (angle >> 8) & 0xff; // Count
                        data[tsi + 2] = (angle >> 16) & 0xff; // Count
                        data[tsi + 3] = (angle >> 24); // Count
                    }
                },
                read: buf => {
                    let v = "vSIM"
                    for (let i = 0; i < buf.data.length; ++i)
                        buf.data[i] = v.charCodeAt(i) || 0
                    return buf.data.length
                },
                write: buf => {
                    if (buf.data.length == 0) return 2;
                    const cmd = buf.data[0];
                    return 2
                },
                ioctl: (id, buf) => {
                    return 2;
                }
            });
        }
    }
}