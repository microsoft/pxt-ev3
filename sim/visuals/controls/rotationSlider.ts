

namespace pxsim.visuals {

    export class RotationSliderControl extends ControlView<GyroSensorNode> {
        private group: SVGGElement;
        private slider: SVGGElement;

        private static SLIDER_WIDTH = 70;
        private static SLIDER_HEIGHT = 78;

        getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement) {
            this.group = svg.elt("g") as SVGGElement;

            const sliderGroup = pxsim.svg.child(this.group, "g");
            sliderGroup.setAttribute("transform", `translate(10,0)`);

            const rotationLine = pxsim.svg.child(sliderGroup, "g");
            pxsim.svg.child(rotationLine, "path", { 'transform': 'translate(7.11 -31.1)', 'd': 'M68.71,99.5l6.1-8S61.3,79.91,42.69,78.35,12,83.14,6.49,85.63a48.69,48.69,0,0,0-9.6,5.89L3.16,99.3S19.27,87.7,37.51,87.94,68.71,99.5,68.71,99.5Z', 'style': 'fill: #626262' });

            this.slider = pxsim.svg.child(sliderGroup, "g") as SVGGElement;
            const handleInner = pxsim.svg.child(sliderGroup, "g");
            pxsim.svg.child(this.slider, "circle", { 'cx': 9, 'cy': 50, 'r': 13, 'style': 'fill: #f12a21' });
            pxsim.svg.child(this.slider, "circle", { 'cx': 9, 'cy': 50, 'r': 12.5, 'style': 'fill: none;stroke: #b32e29' });

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
                if (captured && (ev as MouseEvent).clientX != undefined) {
                    ev.preventDefault();
                    this.updateSliderValue(pt, parent, ev as MouseEvent);
                }
            }, ev => {
                captured = true;
                if ((ev as MouseEvent).clientX != undefined) {
                    this.updateSliderValue(pt, parent, ev as MouseEvent);
                }
            }, () => {
                captured = false;
            })

            return this.group;
        }

        getInnerWidth() {
            return RotationSliderControl.SLIDER_WIDTH * 1.5;
        }

        updateState() {
            if (!this.visible) {
                return;
            }
            const node = this.state;
            const percentage = node.getValue();
            const x = RotationSliderControl.SLIDER_WIDTH * percentage / 100;
            const y = Math.abs((percentage - 50) / 50) * 10;
            this.slider.setAttribute("transform", `translate(${x}, ${y})`);
        }

        private updateSliderValue(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            let cur = svg.cursorPoint(pt, parent, ev);
            const width = CONTROL_WIDTH; //DistanceSliderControl.SLIDER_HEIGHT;
            const bBox = this.content.getBoundingClientRect();
            let t = Math.max(0, Math.min(1, (width + bBox.left / this.scaleFactor - cur.x / this.scaleFactor) / width))

            const state = this.state;
            state.setRate((1 - t) * (100));
        }
    }

}