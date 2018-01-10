

import lf = pxsim.localization.lf;

namespace pxsim.motors {

    export function __motorUsed(port: number, large: boolean) {
        //console.log("MOTOR INIT " + port);
        if (!ev3board().hasMotor(port)) {
            ev3board().motorUsed(port, large);
            runtime.queueDisplayUpdate();
        } else {
            U.userError(`${lf("Multiple motors are connected to Port")} ${String.fromCharCode('A'.charCodeAt(0) + ev3board().motorMap[port])}`);
        }
    }
}

namespace pxsim.sensors {

    export function __sensorUsed(port: number, type: number) {
        //console.log("SENSOR INIT " + port + ", type: " + type);
        if (!ev3board().hasSensor(port)) {
            const sensor = ev3board().getSensor(port, type);
            runtime.queueDisplayUpdate();
        } else {
            U.userError(`${lf("Multiple sensors are connected to Port")} ${port + 1}`);
        }
    }
}