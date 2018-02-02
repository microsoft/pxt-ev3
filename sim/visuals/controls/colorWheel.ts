namespace pxsim.visuals {

    export class ColorWheelControl extends ControlView<ColorSensorNode> {
        private group: SVGGElement;
        private colorGradient: SVGLinearGradientElement;
        private reporter: SVGTextElement;
        private rect: SVGElement;

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
            const bBox = this.rect.getBoundingClientRect();
            const height = bBox.height;
            let t = Math.max(0, Math.min(1, (height + bBox.top / this.scaleFactor - cur.y / this.scaleFactor) / height));
            const state = this.state;
            state.setColor(t * this.getMax());
        }

        getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement) {
            this.group = svg.elt("g") as SVGGElement;

            let gc = "gradient-color";
            this.colorGradient = svg.linearGradient(globalDefs, gc, false);
            svg.setGradientValue(this.colorGradient, "50%");
            svg.setGradientColors(this.colorGradient, "black", "yellow");

            const reporterGroup = pxsim.svg.child(this.group, "g");
            reporterGroup.setAttribute("transform", `translate(${this.getWidth() / 2}, 50)`);
            this.reporter = pxsim.svg.child(reporterGroup, "text", { 'text-anchor': 'middle', 'x': 0, 'y': '0', 'class': 'sim-text number large inverted' }) as SVGTextElement;

            const sliderGroup = pxsim.svg.child(this.group, "g");
            sliderGroup.setAttribute("transform", `translate(${this.getWidth() / 2 - this.getSliderWidth() / 2}, ${this.getReporterHeight()})`);

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
                    "y1": 105,
                    "y2": 105,
                    "style": `stroke-width: 2; stroke: black`
                }
            )

            const highThreshold = pxsim.svg.child(sliderGroup, "line",
                {
                    "stroke-dasharray": "5, 3",
                    "x1": 0,
                    "x2": 62,
                    "y1": 89,
                    "y2": 89,
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
                    rect.setAttribute('cursor', '-webkit-grabbing');
                    this.updateColorLevel(pt, parent, ev as MouseEvent);
                }
            }, () => {
                captured = false;
                rect.setAttribute('cursor', '-webkit-grab');
            }, () => {
                captured = false;
                rect.setAttribute('cursor', '-webkit-grab');
            })

            return this.group;
        }
    }
}