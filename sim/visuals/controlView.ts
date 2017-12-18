/// <reference path="./nodes/staticView.ts" />

namespace pxsim.visuals {

    export const CONTROL_WIDTH = 87.5;
    export const CONTROL_HEIGHT = 175;

    export abstract class ControlView<T extends BaseNode> extends SimView<T> implements LayoutElement {
        private background: SVGSVGElement;

        abstract getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement): SVGElement;

        constructor(protected parent: SVGSVGElement, protected globalDefs: SVGDefsElement, protected state: T, protected port: number) {
            super(state);
        }

        getInnerWidth(): number {
            return CONTROL_WIDTH;
        }

        getInnerHeight(): number {
            return CONTROL_HEIGHT;
        }

        getPaddingRatio() {
            return 0;
        }

        getWiringRatio() {
            return 0.5;
        }

        public hasClick() {
            return false;
        }

        buildDom(width: number): SVGElement {
            this.background = svg.elt("svg", { height: "100%", width: "100%"}) as SVGSVGElement;
            this.background.appendChild(this.getInnerView(this.parent, this.globalDefs));
            return this.background;
        }

        onComponentVisible() {

        }

        getWeight() {
            return 0;
        }
    }
}