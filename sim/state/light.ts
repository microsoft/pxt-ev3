namespace pxsim {

    export class EV3LightState {
        lightPattern: number;

        constructor() {
            this.lightPattern = 0;
        }
    }
}

namespace pxsim.output {

    export function setLights(pattern: number) {
        const brickState = ev3board().getBrickNode();
        const lightState = brickState.lightState;
        lightState.lightPattern = pattern;
        brickState.setChangedState();
    }
}