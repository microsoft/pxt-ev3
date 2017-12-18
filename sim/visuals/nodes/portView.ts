/// <reference path="./staticView.ts" />

namespace pxsim.visuals {

    export class PortView extends StaticModuleView implements LayoutElement {

        constructor(port: NodeType, private label: string) {
            super(PORT_SVG, "port", NodeType.Port, port);
        }

        protected buildDomCore() {
            const textLabel = this.content.getElementById(this.normalizeId("port_text")) as SVGTextElement;
            textLabel.textContent = this.label;
            textLabel.style.userSelect = 'none';
        }

        public getPaddingRatio() {
            return 1 / 6;
        }

        public hasClick() {
            return false;
        }
    }
}