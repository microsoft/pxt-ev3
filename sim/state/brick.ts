/// <reference path="./nodeTypes.ts"/>

namespace pxsim {

    export class PortNode extends BaseNode {
        id = NodeType.Port;

        constructor(port: number) {
            super(port);
        }
    }


    export class BrickNode extends BaseNode {
        id = NodeType.Brick;

        buttonState: EV3ButtonState;
        lightState: EV3LightState;

        constructor() {
            super(-1);

            this.buttonState = new EV3ButtonState();
            this.lightState = new EV3LightState();
        }
    }
}