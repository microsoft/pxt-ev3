

namespace pxsim.visuals {

    export class ColorWheelControl extends ControlView<ColorSensorNode> {
        private group: SVGGElement;
        private colorGradient: SVGLinearGradientElement;
        private defs: SVGDefsElement;
        private reporter: SVGTextElement;

        private rect: SVGElement;
        private sliderGroup: SVGElement;

        getInnerWidth() {
            return 111;
        }

        getInnerHeight() {
            return 192;
        }

        private getReporterHeight() {
            return 58;
        }

        private getSliderWidth() {
            return 62;
        }

        private getSliderHeight() {
            return 111;
        }

        private getMax() {
            // TODO
            return 100;
        }

        updateState() {
            if (!this.visible) {
                return;
            }
            const node = this.state;
            const percentage = node.getValue();
            const inversePercentage = this.getMax() - percentage;
            svg.setGradientValue(this.colorGradient, inversePercentage + "%");
            this.reporter.textContent = `${parseFloat((percentage).toString()).toFixed(0)}`;
        }

        updateColorLevel(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            let cur = svg.cursorPoint(pt, parent, ev);
            //const height = this.getSliderHeight();
            //const bBox = this.content.getBoundingClientRect();
            const bBox = this.rect.getBoundingClientRect();
            const height = bBox.height;
            let t = Math.max(0, Math.min(1, (height + bBox.top / this.scaleFactor - cur.y / this.scaleFactor) / height));
            const state = this.state;
            state.setColor(t * this.getMax());
        }

        getInnerView(parent: SVGSVGElement) {
            this.defs = <SVGDefsElement>svg.child(this.element, "defs", {});
            this.group = svg.elt("g") as SVGGElement;
            //this.group.setAttribute("transform", `translate(12, 0) scale(2)`)

            let gc = "gradient-color";
            this.colorGradient = svg.linearGradient(this.defs, gc, false);
            svg.setGradientValue(this.colorGradient, "50%");
            svg.setGradientColors(this.colorGradient, "black", "yellow");

            const reporterGroup = pxsim.svg.child(this.group, "g");
            reporterGroup.setAttribute("transform", `translate(${this.getWidth() / 2}, 50)`);
            this.reporter = pxsim.svg.child(reporterGroup, "text", { 'text-anchor': 'middle', 'x': 0, 'y': '0', 'class': 'sim-text number large inverted' }) as SVGTextElement;

            const sliderGroup = pxsim.svg.child(this.group, "g");
            sliderGroup.setAttribute("transform", `translate(${this.getWidth() / 2 - this.getSliderWidth() / 2}, ${this.getReporterHeight()})`);
            this.sliderGroup = sliderGroup;

            const rect = pxsim.svg.child(sliderGroup, "rect",
                {
                    "x": 0,
                    "y": 0,
                    "width": this.getSliderWidth(),
                    "height": this.getSliderHeight(),
                    "style": `fill: url(#${gc})`
                }
            )

            this.rect = rect;

            const lowThreshold = pxsim.svg.child(sliderGroup, "line",
                {
                    "stroke-dasharray": "5, 3",
                    "x1": 0,
                    "x2": 62,
                    "y1": 69,
                    "y2": 69,
                    "style": `stroke-width: 2; stroke: black`
                }
            )

            const highThreshold = pxsim.svg.child(sliderGroup, "line",
                {
                    "stroke-dasharray": "5, 3",
                    "x1": 0,
                    "x2": 62,
                    "y1": 57,
                    "y2": 57,
                    "style": `stroke-width: 2; stroke: black`
                }
            )

            let pt = parent.createSVGPoint();
            let captured = false;
            touchEvents(rect, ev => {
                if (captured && (ev as MouseEvent).clientY) {
                    ev.preventDefault();
                    this.updateColorLevel(pt, parent, ev as MouseEvent);
                }
            }, ev => {
                captured = true;
                if ((ev as MouseEvent).clientY) {
                    //rect.setAttribute('cursor', '-webkit-grabbing');
                    this.updateColorLevel(pt, parent, ev as MouseEvent);
                }
            }, () => {
                captured = false;
                //rect.setAttribute('cursor', '-webkit-grab');
            }, () => {
                captured = false;
                //rect.setAttribute('cursor', '-webkit-grab');
            })

            return this.group;

            /**
            const rect = pxsim.svg.child(this.group, "g");
            const innerRect = pxsim.svg.child(rect, "rect",
                {cursor: '-webkit-grab',
                fill: `url(#${gc})`,
                width: this.getInnerWidth(),
                height: this.getInnerHeight()
            });

            innerRect.setAttribute("transform", `translate(12, 0) scale(2)`);

            let pt = parent.createSVGPoint();
            let captured = false;
            touchEvents(rect,
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
            **/
        }

        /*
        updateState() {
            if (!this.visible) {
                return;
            }
            const node = this.state;
            const percentage = node.getValue();
            svg.setGradientValue(this.colorGradient, percentage + "%");
        }

        private setColor(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            const height = CONTROL_HEIGHT;
            let cur = svg.cursorPoint(pt, parent, ev);
            //let t = Math.max(0, Math.min(1, (width + this.left / this.scaleFactor - cur.x / this.scaleFactor) / width));
            let t = Math.max(0, Math.min(1, (height + this.top/this.scaleFactor - cur.y/this.scaleFactor) / height));
            const state = this.state;
            state.setColor((1-t)*100);
        }
        **/
    }

}

// scaleFactor = 0-1
// height = size of the element
// top, left = x, y of top corner