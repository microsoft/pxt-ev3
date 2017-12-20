namespace pxsim {

    export class EV3OutputState {

        constructor() {
            let data = new Uint8Array(10)
            MMapMethods.register("/dev/lms_pwm", {
                data,
                beforeMemRead: () => {
                    //console.log("pwm before read");
                    for (let i = 0; i < 10; ++i)
                        data[i] = 0
                },
                read: buf => {
                    let v = "vSIM"
                    for (let i = 0; i < buf.data.length; ++i)
                        buf.data[i] = v.charCodeAt(i) || 0
                    console.log("pwm read");
                    return buf.data.length
                },
                write: buf => {
                    if (buf.data.length == 0) return 2;
                    const cmd = buf.data[0];
                    switch (cmd) {
                        case DAL.opProgramStart: {
                            // init
                            console.log('init');
                            return 2;
                        }
                        case DAL.opOutputReset: {
                            // reset
                            const port = buf.data[1];
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.reset());
                            return 2;
                        }
                        case DAL.opOutputStepSpeed: {
                            // step speed
                            const port = buf.data[1];
                            const speed = buf.data[2] << 24 >> 24; // signed byte
                            // note that b[3] is padding
                            const step1 = buf.data[4];
                            const step2 = buf.data[5]; // angle
                            const step3 = buf.data[6];
                            const brake = buf.data[7];
                            //console.log(buf);
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.stepSpeed(speed, step2, brake === 1));
                            return 2;
                        }
                        case DAL.opOutputStop: {
                            // stop
                            const port = buf.data[1];
                            const brake = buf.data[2];
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.stop());
                            return 2;
                        }
                        case DAL.opOutputSpeed: {
                            // setSpeed
                            const port = buf.data[1];
                            const speed = buf.data[2] << 24 >> 24; // signed byte
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.setSpeed(speed));
                            return 2;
                        }
                        case DAL.opOutputStart: {
                            // start
                            const port = buf.data[1];
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.start());
                            return 2;
                        }
                        case DAL.opOutputPolarity: {
                            // reverse
                            const port = buf.data[1];
                            const polarity = buf.data[2];
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.setPolarity(polarity));
                            return 2;
                        }
                        case DAL.opOutputSetType: {
                            const port = buf.data[1];
                            const large = buf.data[2] == 0x07;
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.setLarge(large));
                            return 2;
                        }
                    }

                    console.log("pwm write");
                    console.log(buf);
                    return 2
                },
                ioctl: (id, buf) => {
                    console.log("pwm ioctl");
                    console.log(id);
                    console.log(buf);
                    return 2;
                }
            });
        }
    }
}