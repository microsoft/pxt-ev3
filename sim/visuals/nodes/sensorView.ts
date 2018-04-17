/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {

    export abstract class SensorView extends ModuleView implements LayoutElement {

        constructor(xml: string, prefix: string, id: NodeType, port: NodeType) {
            super(xml, prefix, id, port);
        }

        public getSelected() {
            return true;
        }

        public hasClose() {
            return false;
        }
    }
}