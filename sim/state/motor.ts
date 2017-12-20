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
                    console.log("motor before read");
                    for (let port = 0; port < DAL.NUM_OUTPUTS; ++port) {
                        const output = outputs[port];
                        data[MotorDataOff.TachoCounts + port * MotorDataOff.Size] = 0; // Tacho count
                        data[MotorDataOff.Speed + port * MotorDataOff.Size] = output ? outputs[port].getSpeed() : 0; // Speed
                        data[MotorDataOff.TachoSensor + port * MotorDataOff.Size] = output ? outputs[port].getAngle() : 0; // Count
                    }
                },
                read: buf => {
                    let v = "vSIM"
                    for (let i = 0; i < buf.data.length; ++i)
                        buf.data[i] = v.charCodeAt(i) || 0
                    console.log("motor read");
                    console.log(buf.data);
                    return buf.data.length
                },
                write: buf => {
                    if (buf.data.length == 0) return 2;
                    const cmd = buf.data[0];
                    console.log("motor write");
                    console.log(buf);
                    return 2
                },
                ioctl: (id, buf) => {
                    console.log("motor ioctl");
                    console.log(id);
                    console.log(buf);
                    return 2;
                }
            });
        }
    }
}