/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export class InfraredView extends ModuleView implements LayoutElement {

        constructor(port: number) {
            super(INFRARED_SVG, "infrared", NodeType.InfraredSensor, port);
        }

        protected optimizeForLightMode() {
            (this.content.getElementById(this.normalizeId('path9245')) as SVGElement).style.fill = '#f2f2f2';
        }
    }
}