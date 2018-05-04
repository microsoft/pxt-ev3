/// <reference path="./nodes/moduleView.ts" />

namespace pxsim.visuals {

    export class WireView extends View implements LayoutElement {
        private wire: SVGSVGElement;
        private path: SVGPathElement;
        private hasDimensions: boolean;

        protected startX: number;
        protected startY: number;
        protected endX: number;
        protected endY: number;

        constructor(private port: number) {
            super();
        }

        isRendered() {
            return !!this.wire;
        }

        updateDimensions(startX: number, startY: number, endX: number, endY: number) {
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
            this.hasDimensions = true;
            this.updatePath();
        }

        buildDom(): SVGElement {
            this.wire = svg.elt("svg", { height: "100%", width: "100%" }) as SVGSVGElement;
            this.path = pxsim.svg.child(this.wire, "path", {
                'd': '',
                'fill': 'transparent',
                'stroke': '#5A5A5A',
                'stroke-width': '3px'
            }) as SVGPathElement;
            this.setSelected(true);
            return this.wire;
        }

        public updateThemeCore() {
            let theme = this.theme;
            this.path.setAttribute('stroke', theme.wireColor);
        }

        updatePath() {
            if (!this.hasDimensions) return;
            const height = this.endY - this.startY;
            const thirdHeight = height / 3;
            const middleHeight = this.port == 1 || this.port == 2 ? thirdHeight : thirdHeight * 2;
            let d = `M${this.startX} ${this.startY}`;
            d += ` L${this.startX} ${this.startY + middleHeight}`;
            d += ` L${this.endX} ${this.startY + middleHeight}`;
            d += ` L${this.endX} ${this.endY}`;
            this.path.setAttribute('d', d);
        }

        getId() {
            return -2;
        }

        getPort() {
            return this.port;
        }

        getPaddingRatio() {
            return 0;
        }

        getWiringRatio() {
            return 0.5;
        }

        getInnerWidth(): number {
            return CONTROL_WIDTH;
        }

        getInnerHeight(): number {
            return CONTROL_HEIGHT;
        }

        public setSelected(selected: boolean) {
            super.setSelected(selected);
            this.updateOpacity();
        }

        protected updateOpacity() {
            const opacity = this.selected ? "0.2" : "1";
            this.setOpacity(opacity);
        }

        protected setOpacity(opacity: string) {
            this.element.setAttribute("opacity", opacity);
        }

        public hasClick() {
            return false;
        }
    }
}