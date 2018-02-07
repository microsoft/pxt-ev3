/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export class InfraredView extends ModuleView implements LayoutElement {

        constructor(port: number) {
            super(INFRARED_SVG, "infrared", NodeType.InfraredSensor, port);
        }
    }
}