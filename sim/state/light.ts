namespace pxsim {

    export class EV3LightState {
        lightPattern: number;

        constructor() {
            this.lightPattern = 0;
        }
    }
}

namespace pxsim.output {

    export function setLights(pattern: number){
        const lightState = (board() as DalBoard).lightState;
        lightState.lightPattern = pattern;
        runtime.queueDisplayUpdate();
    }
}