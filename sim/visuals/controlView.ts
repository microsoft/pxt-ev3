/// <reference path="./nodes/moduleView.ts" />

namespace pxsim.visuals {

    export const CONTROL_WIDTH = 76.84;
    export const CONTROL_HEIGHT = 112.72;

    export const CONTROL_TEXT_COLOR = '#000';

    export abstract class ControlView<T extends BaseNode> extends SimView<T> implements LayoutElement {
        protected content: SVGSVGElement;

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

        buildDom(): SVGElement {
            this.content = svg.elt("svg", { viewBox: `0 0 ${this.getInnerWidth()} ${this.getInnerHeight()}` }) as SVGSVGElement;
            this.content.appendChild(this.getInnerView(this.parent, this.globalDefs));
            return this.content;
        }

        public resize(width: number, height: number, strict?: boolean) {
            super.resize(width, height);
            this.updateDimensions(width, height, strict);
        }

        private updateDimensions(width: number, height: number, strict?: boolean) {
            if (this.content) {
                const currentWidth = this.getInnerWidth();
                const currentHeight = this.getInnerHeight();
                const newHeight = Math.max(0, currentHeight / currentWidth * width);
                const newWidth = Math.max(0, currentWidth / currentHeight * height);
                if (strict) {
                    this.content.setAttribute('width', `${width}`);
                    this.content.setAttribute('height', `${height}`);
                } else if (newHeight > height) {
                    // scale width instead
                    this.content.setAttribute('width', `${newWidth}`);
                    this.content.setAttribute('height', `${height}`);
                    this.width = newWidth;
                } else {
                    this.content.setAttribute('width', `${width}`);
                    this.content.setAttribute('height', `${newHeight}`);
                    this.height = newHeight;
                }
            }
        }

        onComponentVisible() {
        }
    }
}