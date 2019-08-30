

namespace pxsim.visuals {

    export class BackgroundViewControl extends ControlView<PortNode> {
        private backgroundGroup: SVGGElement;
        private backgroundRect: SVGRectElement;

        getInnerView() {
            this.backgroundGroup = svg.elt("g") as SVGGElement;
            this.backgroundRect = pxsim.svg.child(this.backgroundGroup,
                "rect", {
                    'x': 0, 'y': 0,
                    'width': '100%',
                    'height': '100%',
                    'style': `fill: ${this.theme.backgroundViewColor};stroke: #A8A9A8; stroke-width: 3px; stroke-opacity: 0.2`
                }) as SVGRectElement;
            return this.backgroundGroup;
        }

        buildDom(): SVGElement {
            this.content = svg.elt("svg", { width: "100%", height: "100%"}) as SVGSVGElement;
            this.content.appendChild(this.getInnerView());
            return this.content;
        }

        public resize(width: number, height: number, strict?: boolean) {
            super.resize(width, height, strict);
            this.backgroundRect.setAttribute('stroke-dasharray', `${height + width + height} 1000`);
            this.backgroundRect.setAttribute('stroke-dashoffset', `-${width}`);
        }

        getInnerWidth(): number {
            return 76.84;
        }

        getInnerHeight(): number {
            return 173.86;
        }
    }

}