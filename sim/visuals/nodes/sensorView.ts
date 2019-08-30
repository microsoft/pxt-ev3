/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {

    export abstract class SensorView extends ModuleView implements LayoutElement {

        constructor(xml: string, prefix: string, id: NodeType, port: NodeType) {
            super(xml, prefix, id, port);
            // Shown by default
            this.selected = true;
        }

        protected fadeWhenSelected() {
            return false;
        }

        public hasBackground() {
            return true;
        }
    }
}