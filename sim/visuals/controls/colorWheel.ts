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
            return 38;
        }

        private getSliderWidth() {
            return 62;
        }

        private getSliderHeight() {
            return 131;
        }

        private getMaxValue(state: ColorSensorMode) {
            return (state == ColorSensorMode.RefRaw ? 1023 : 100);
        }

        private mapValue(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
            return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        }

        updateState() {
            if (!this.visible) {
                return;
            }
            const node = this.state;
            const value = node.getValue();
            let inverseValue = this.getMaxValue(node.getMode()) - value;
            if (node.getMode() == ColorSensorMode.RefRaw) inverseValue = this.mapValue(inverseValue, 0, 1023, 0, 100);
            svg.setGradientValue(this.colorGradient, inverseValue + "%");
            this.reporter.textContent = `${parseFloat((value).toString()).toFixed(0)}`;
            if (node.getMode() != ColorSensorMode.RefRaw) this.reporter.textContent += `%`;
        }

        updateColorLevel(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            let cur = svg.cursorPoint(pt, parent, ev);
            const bBox = this.rect.getBoundingClientRect();
            const height = bBox.height;
            let t = Math.max(0, Math.min(1, (height + bBox.top / this.scaleFactor - cur.y / this.scaleFactor) / height));
            const state = this.state;
            state.setColor(t * this.getMaxValue(state.getMode()));
        }

        getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement) {
            this.group = svg.elt("g") as SVGGElement;

            let gc = "gradient-color-" + this.getPort();
            const prevColorGradient = globalDefs.querySelector(`#${gc}`) as SVGLinearGradientElement;
            this.colorGradient = prevColorGradient ? prevColorGradient : svg.linearGradient(globalDefs, gc, false);
            svg.setGradientValue(this.colorGradient, "50%");
            svg.setGradientColors(this.colorGradient, "black", "yellow");

            const reporterGroup = pxsim.svg.child(this.group, "g");
            reporterGroup.setAttribute("transform", `translate(${this.getWidth() / 2}, 20)`);
            this.reporter = pxsim.svg.child(reporterGroup, "text", { 'text-anchor': 'middle', 'x': 0, 'y': '0', 'class': 'sim-text number large inverted' }) as SVGTextElement;

            const sliderGroup = pxsim.svg.child(this.group, "g");
            sliderGroup.setAttribute("transform", `translate(${this.getWidth() / 2 - this.getSliderWidth() / 2}, ${this.getReporterHeight()})`);

            const rect = pxsim.svg.child(sliderGroup, "rect",
                {
                    "width": this.getSliderWidth(),
                    "height": this.getSliderHeight(),
                    "style": `fill: url(#${gc})`
                }
            )
            this.rect = rect;

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
            })

            return this.group;
        }
    }
}