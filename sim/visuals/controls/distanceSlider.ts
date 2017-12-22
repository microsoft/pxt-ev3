

namespace pxsim.visuals {

    export class DistanceSliderControl extends ControlView<UltrasonicSensorNode> {
        private group: SVGGElement;
        private gradient: SVGLinearGradientElement;
        private slider: SVGGElement;

        private static SLIDER_HANDLE_HEIGHT = 31;

        private isVisible = false;

        getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement) {
            let gid = "gradient-slider-" + this.getId();
            this.group = svg.elt("g") as SVGGElement;
            this.gradient = createGradient(gid, this.getGradientDefinition());
            this.gradient.setAttribute('x1', '-438.37');
            this.gradient.setAttribute('y1', '419.43');
            this.gradient.setAttribute('x2', '-438.37');
            this.gradient.setAttribute('y2', '418.43');
            this.gradient.setAttribute('gradientTransform', 'matrix(50, 0, 0, -110, 21949.45, 46137.67)');
            this.gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
            globalDefs.appendChild(this.gradient);

            this.group = svg.elt("g") as SVGGElement;

            const sliderGroup = pxsim.svg.child(this.group, "g");
            sliderGroup.setAttribute("transform", `translate(0, ${10 + this.getTopPadding()})`)

            const rect = pxsim.svg.child(sliderGroup, "rect", { 'x': this.getLeftPadding(), 'y': 2, 'width': this.getWidth() - this.getLeftPadding() * 2, 'height': this.getContentHeight(), 'style': `fill: url(#${gid})` });

            this.slider = pxsim.svg.child(sliderGroup, "g", { "transform": "translate(0,0)" }) as SVGGElement;
            const sliderInner = pxsim.svg.child(this.slider, "g");
            pxsim.svg.child(sliderInner, "rect", { 'width': this.getWidth(), 'height': DistanceSliderControl.SLIDER_HANDLE_HEIGHT, 'rx': '2', 'ry': '2', 'style': 'fill: #f12a21' });
            pxsim.svg.child(sliderInner, "rect", { 'x': '0.5', 'y': '0.5', 'width': this.getWidth() - 1, 'height': DistanceSliderControl.SLIDER_HANDLE_HEIGHT - 1, 'rx': '1.5', 'ry': '1.5', 'style': 'fill: none;stroke: #b32e29' });

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
                    this.updateSliderValue(pt, parent, ev as MouseEvent);
                }
            }, () => {
                captured = false;
            }, () => {
                captured = false;
            })

            return this.group;
        }

        private getLeftPadding() {
            return this.getInnerWidth() * 0.12;
        }

        private getTopPadding() {
            return this.getInnerHeight() / 4;
        }

        private getContentHeight() {
            return this.getInnerHeight() * 0.6;
        }

        updateState() {
            if (!this.isVisible) {
                return;
            }
            const node = this.state;
            const percentage = node.getValue() / 10; /* convert back to cm */
            const y = this.getContentHeight() * percentage / this.getMax();
            this.slider.setAttribute("transform", `translate(0, ${y - DistanceSliderControl.SLIDER_HANDLE_HEIGHT / 2})`);
        }

        onComponentVisible() {
            super.onComponentVisible();
            this.isVisible = true;
        }

        onComponentHidden() {
            this.isVisible = false;
        }

        private updateSliderValue(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            let cur = svg.cursorPoint(pt, parent, ev);
            const height = this.getContentHeight(); //DistanceSliderControl.SLIDER_HEIGHT;
            const bBox = this.content.getBoundingClientRect();
            let t = Math.max(0, Math.min(1, (this.getTopPadding() + height + bBox.top / this.scaleFactor - cur.y / this.scaleFactor) / height))

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
                    { offset: 1, color: "#ddd" }
                ]
            };
        }
    }

}