

namespace pxsim.visuals {

    export class ColorWheelControl extends ControlView<ColorSensorNode> {
        private group: SVGGElement;
        private colorGradient: SVGLinearGradientElement;
        private defs: SVGDefsElement;

        getInnerView(parent: SVGSVGElement) {
            this.defs = <SVGDefsElement>svg.child(this.element, "defs", {});
            this.group = svg.elt("g") as SVGGElement;
            this.group.setAttribute("transform", `translate(12, ${this.getHeight() / 2 - 15}) scale(2.5)`)

            let gc = "gradient-color";
            this.colorGradient = svg.linearGradient(this.defs, gc, true);
            svg.setGradientValue(this.colorGradient, "50%");
            svg.setGradientColors(this.colorGradient, "black", "white");

            const circle = pxsim.svg.child(this.group, "g");
            const innerCircle = pxsim.svg.child(circle, "circle",
                {cursor: '-webkit-grab',
                fill: `url(#${gc})`,
                r: 17,
                cx: 13,
                cy: 20,
                stroke: 'black',
                'stroke-width': 2
            });

            let pt = parent.createSVGPoint();
            let captured = false;
            touchEvents(circle,
                ev => {
                    if (captured && (ev as MouseEvent).clientX) {
                        ev.preventDefault();
                        this.setColor(pt, parent, ev as MouseEvent);
                    }
                },
                ev => {
                    captured = true;
                    if ((ev as MouseEvent).clientX) {
                        this.setColor(pt, parent, ev as MouseEvent);
                    }
                },
                ev => {
                    captured = false;
                },
                ev => {
                    captured = false;
                }
            )
            return this.group;
        }

        updateState() {
            if (!this.visible) {
                return;
            }
            const node = this.state;
            const percentage = node.getValue();
            svg.setGradientValue(this.colorGradient, percentage + "%");
        }

        private setColor(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            const width = CONTROL_WIDTH;
            let cur = svg.cursorPoint(pt, parent, ev);
            let t = Math.max(0, Math.min(1, (width + this.left / this.scaleFactor - cur.x / this.scaleFactor) / width));
            const state = this.state;
            state.setColor((1-t)*100);
        }
    }

}