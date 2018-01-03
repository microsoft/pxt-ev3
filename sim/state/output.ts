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
                        case DAL.opOutputClearCount:
                            const port = buf.data[1];
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.clearCount());
                            break;
                        case DAL.opOutputStepPower:
                        case DAL.opOutputStepSpeed:
                        case DAL.opOutputTimePower:
                        case DAL.opOutputTimeSpeed: {
                            // step speed
                            const port = buf.data[1];
                            const speed = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int8LE, 2); // signed byte
                            // note that b[3] is padding                            
                            const step1 = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int32LE, 4);
                            const step2 = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int32LE, 8);
                            const step3 = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int32LE, 12);
                            const brake = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int8LE, 16);
                            //console.log(buf);
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.setSpeedCmd(cmd, [speed, step1, step2, step3, brake]));
                            return 2;
                        }
                        case DAL.opOutputStepSync:
                        case DAL.opOutputTimeSync: {
                            const port = buf.data[1];
                            const speed = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int8LE, 2); // signed byte
                            // note that b[3] is padding
                            const turnRatio = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int16LE, 4);
                            // b[6], b[7] is padding
                            const stepsOrTime = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int32LE, 8);
                            const brake = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int8LE, 12);

                            const motors = ev3board().getMotor(port);
                            for (const motor of motors) {
                                const otherMotor = motors.filter(m => m.port != motor.port)[0];
                                motor.setSyncCmd(
                                    motor.port < otherMotor.port ? otherMotor : undefined,
                                    cmd, [speed, turnRatio, stepsOrTime, brake]);
                            }
                            return 2;
                        }
                        case DAL.opOutputStop: {
                            // stop
                            const port = buf.data[1];
                            const brake = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int8LE, 2);
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.stop());
                            return 2;
                        }
                        case DAL.opOutputSpeed: {
                            // setSpeed
                            const port = buf.data[1];
                            const speed = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int8LE, 2);
                            const motors = ev3board().getMotor(port);
                            motors.forEach(motor => motor.setSpeedCmd(cmd, [speed]));
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
                            const polarity = pxsim.BufferMethods.getNumber(buf, BufferMethods.NumberFormat.Int8LE, 2);
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
                        default:
                            console.warn('unknown cmd: ' + cmd);
                            break;
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