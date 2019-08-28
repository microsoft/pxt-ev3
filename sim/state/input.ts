

import lf = pxsim.localization.lf;

namespace pxsim.motors {
    function portsToString(out: number): string {
        let r = "";
        for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
            if (out & (1 << i)) {
                if (r.length > 0) r += "+";
                r += "ABCD"[i];
            }
        }
        return r;
    }

    export function __motorUsed(ports: number, large: boolean) {
        //console.log("MOTOR INIT " + port);
        if (ev3board().motorUsed(ports, large))
            runtime.queueDisplayUpdate();
        else
            U.userError(`${lf("Multiple motors are connected to Port")} ${portsToString(ports)}`);
    }
}

namespace pxsim.sensors {

    export function __sensorUsed(port: number, type: number) {
        //console.log("SENSOR INIT " + port + ", type: " + type);
        if (type == DAL.DEVICE_TYPE_IIC_UNKNOWN) return; // Ignore IIC        
        if (!ev3board().hasSensor(port)) {
            const sensor = ev3board().getSensor(port, type);
            runtime.queueDisplayUpdate();
        } else {
            U.userError(`${lf("Multiple sensors are connected to Port")} ${port + 1}`);
        }
    }
}