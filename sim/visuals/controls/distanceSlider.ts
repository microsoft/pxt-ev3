

namespace pxsim.visuals {

    export class DistanceSliderControl extends ControlView<UltrasonicSensorNode> {
        private group: SVGGElement;
        private gradient: SVGLinearGradientElement;
        private slider: SVGGElement;

        private reporter: SVGTextElement;

        private static SLIDER_HANDLE_HEIGHT = 26;
        private static SLIDER_SIDE_PADDING = 6;

        getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement) {
            let gid = "gradient-slider-" + this.getPort();
            this.group = svg.elt("g") as SVGGElement;
            const prevGradient = globalDefs.querySelector(`#${gid}`) as SVGLinearGradientElement;
            this.gradient = prevGradient ? prevGradient : createGradient(gid, this.getGradientDefinition());
            this.gradient.setAttribute('x1', '0%');
            this.gradient.setAttribute('y1', '0%');
            this.gradient.setAttribute('x2', '0%');
            this.gradient.setAttribute('y2', '100%');
            // this.gradient.setAttribute('gradientTransform', 'matrix(50, 0, 0, -110, 21949.45, 46137.67)');
            // this.gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
            globalDefs.appendChild(this.gradient);

            this.group = svg.elt("g") as SVGGElement;

            const reporterGroup = pxsim.svg.child(this.group, "g");
            reporterGroup.setAttribute("transform", `translate(${this.getWidth() / 2}, 42)`);
            this.reporter = pxsim.svg.child(reporterGroup, "text", { 'text-anchor': 'middle', 'x': 0, 'y': '0', 'class': 'sim-text number large inverted' }) as SVGTextElement;

            const sliderGroup = pxsim.svg.child(this.group, "g");
            sliderGroup.setAttribute("transform", `translate(${this.getWidth() / 2 - this.getSliderWidth() / 2}, ${this.getReporterHeight()})`)

            const rect = pxsim.svg.child(sliderGroup, "rect", { 'x': DistanceSliderControl.SLIDER_SIDE_PADDING, 'y': 2, 'width': this.getSliderWidth() - DistanceSliderControl.SLIDER_SIDE_PADDING * 2, 'height': this.getSliderHeight(), 'style': `fill: url(#${gid})` });

            this.slider = pxsim.svg.child(sliderGroup, "g", { "transform": "translate(0,0)" }) as SVGGElement;
            const sliderInner = pxsim.svg.child(this.slider, "g");
            pxsim.svg.child(sliderInner, "rect", { 'width': this.getSliderWidth(), 'height': DistanceSliderControl.SLIDER_HANDLE_HEIGHT, 'rx': '2', 'ry': '2', 'style': 'fill: #f12a21' });
            pxsim.svg.child(sliderInner, "rect", { 'x': '0.5', 'y': '0.5', 'width': this.getSliderWidth() - 1, 'height': DistanceSliderControl.SLIDER_HANDLE_HEIGHT - 1, 'rx': '1.5', 'ry': '1.5', 'style': 'fill: none;stroke: #b32e29' });

            const dragSurface = svg.child(this.group, "rect", {
                x: 0,
                y: 0,
                width: this.getInnerWidth(),
                height: this.getInnerHeight(),
                opacity: 0,
                cursor: '-webkit-grab'
            })

            let pt = parent.createSVGPoint();
            let captured = false;

            touchEvents(dragSurface, ev => {
                if (captured && (ev as MouseEvent).clientY != undefined) {
                    ev.preventDefault();
                    this.updateSliderValue(pt, parent, ev as MouseEvent);
                }
            }, ev => {
                captured = true;
                if ((ev as MouseEvent).clientY != undefined) {
                    dragSurface.setAttribute('cursor', '-webkit-grabbing');
                    this.updateSliderValue(pt, parent, ev as MouseEvent);
                }
            }, () => {
                captured = false;
                dragSurface.setAttribute('cursor', '-webkit-grab');
            })

            return this.group;
        }

        getInnerHeight() {
            return 192;
        }

        getInnerWidth() {
            return 111;
        }

        private getReporterHeight() {
            return 50;
        }

        private getSliderHeight() {
            return 110;
        }

        private getSliderWidth() {
            return 62;
        }

        updateState() {
            if (!this.visible) {
                return;
            }
            const node = this.state;
            const percentage = node.getValue() / 10; /* convert back to cm */
            const y = this.getSliderHeight() * percentage / this.getMax();
            this.slider.setAttribute("transform", `translate(0, ${y - DistanceSliderControl.SLIDER_HANDLE_HEIGHT / 2})`);
            // Update reporter text
            this.reporter.textContent = `${parseFloat((percentage).toString()).toFixed(0)}`;
        }

        private updateSliderValue(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            let cur = svg.cursorPoint(pt, parent, ev);
            const height = this.getSliderHeight();
            const bBox = this.content.getBoundingClientRect();
            let t = Math.max(0, Math.min(1, (DistanceSliderControl.SLIDER_HANDLE_HEIGHT + height + bBox.top / this.scaleFactor - cur.y / this.scaleFactor) / height))

            const state = this.state;
            state.setDistance((1 - t) * (this.getMax()));
        }

        private getMin() {
            return 0;
        }

        private getMax() {
            return 250; //cm
        }

        private getGradientDefinition(): LinearGradientDefinition {
            return {
                stops: [
                    { offset: 0, color: '#626262' },
                    { offset: 100, color: "#ddd" }
                ]
            };
        }
    }

}