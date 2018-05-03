

namespace pxsim.visuals {

    export class MotorSliderControl extends ControlView<MotorNode> {
        private group: SVGGElement;
        private gradient: SVGLinearGradientElement;
        private slider: SVGGElement;

        private reporter: SVGTextElement;

        private dial: SVGGElement;

        private static SLIDER_RADIUS = 100;

        private internalAngle: number = 0;

        getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement) {
            this.group = svg.elt("g") as SVGGElement;

            const slider = pxsim.svg.child(this.group, 'g', { 'transform': 'translate(25,25)' })
            const outerCircle = pxsim.svg.child(slider, "circle", {
                'stroke-dasharray': '565.48', 'stroke-dashoffset': '0',
                'cx': 100, 'cy': 100, 'r': '90', 'style': `fill:transparent;`,
                'stroke': '#a8aaa8', 'stroke-width': '1rem'
            }) as SVGCircleElement;

            this.reporter = pxsim.svg.child(this.group, "text", {
                'x': this.getInnerWidth() / 2, 'y': this.getInnerHeight() / 2,
                'text-anchor': 'middle', 'dominant-baseline': 'middle',
                'style': 'font-size: 50px',
                'class': 'sim-text inverted number'
            }) as SVGTextElement;

            this.dial = pxsim.svg.child(slider, "g", { 'cursor': '-webkit-grab' }) as SVGGElement;
            const handleInner = pxsim.svg.child(this.dial, "g");
            pxsim.svg.child(handleInner, "circle", { 'cx': 0, 'cy': 0, 'r': 30, 'style': 'fill: #f12a21;' });
            pxsim.svg.child(handleInner, "circle", { 'cx': 0, 'cy': 0, 'r': 29.5, 'style': 'fill: none;stroke: #b32e29' });

            this.updateDial();

            let pt = parent.createSVGPoint();
            let captured = false;

            const dragSurface = svg.child(this.group, "rect", {
                x: 0,
                y: 0,
                width: this.getInnerWidth(),
                height: this.getInnerHeight(),
                opacity: 0,
                cursor: '-webkit-grab'
            })

            touchEvents(dragSurface, ev => {
                if (captured && (ev as MouseEvent).clientY != undefined) {
                    ev.preventDefault();
                    this.updateSliderValue(pt, parent, ev as MouseEvent);
                    this.handleSliderMove();
                }
            }, ev => {
                captured = true;
                if ((ev as MouseEvent).clientY != undefined) {
                    this.updateSliderValue(pt, parent, ev as MouseEvent);
                    this.handleSliderDown();
                }
            }, () => {
                captured = false;
                this.handleSliderUp();
            }, () => {
                captured = false;
                this.handleSliderUp();
            })

            return this.group;
        }

        getInnerWidth() {
            return 250;
        }

        getInnerHeight() {
            return 250;
        }

        private lastPosition: number;
        private prevVal: number;
        private updateSliderValue(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            let cur = svg.cursorPoint(pt, parent, ev);
            let bBox = this.content.getBoundingClientRect();

            const coords = {
                x: cur.x / this.scaleFactor - bBox.left / this.scaleFactor,
                y: cur.y / this.scaleFactor - bBox.top / this.scaleFactor
            };
            const radius = MotorSliderControl.SLIDER_RADIUS / 2;
            const dx = coords.x - radius;
            const dy = coords.y - radius;
            const atan = Math.atan(-dy / dx);
            let deg = Math.ceil(atan * (180 / Math.PI));

            if (dx < 0) {
                deg -= 270;
            } else if (dy > 0) {
                deg -= 450;
            } else if (dx >= 0 && dy <= 0) {
                deg = 90 - deg;
            }
            const value = Math.abs(Math.ceil((deg % 360)));

            this.internalAngle = value;
            this.updateDial();

            this.prevVal = deg;
            this.lastPosition = cur.x;
        }

        private handleSliderDown() {
            const state = this.state;
            state.manualMotorDown();
        }

        private handleSliderMove() {
            this.dial.setAttribute('cursor', '-webkit-grabbing');
            const state = this.state;
            state.manualMotorAngle(this.internalAngle);
        }

        private handleSliderUp() {
            this.dial.setAttribute('cursor', '-webkit-grab');
            const state = this.state;
            state.manualMotorUp();

            this.internalAngle = 0;
            this.updateDial();
        }

        private updateDial() {
            let angle = this.internalAngle;

            // Update dial position
            const radius = MotorSliderControl.SLIDER_RADIUS;
            const dialRadius = 5;
            const x = Math.ceil((radius - dialRadius) * Math.sin(angle * Math.PI / 180)) + radius;
            const y = Math.ceil((radius - dialRadius) * -Math.cos(angle * Math.PI / 180)) + radius;
            this.dial.setAttribute('transform', `translate(${x}, ${y})`);
        }

        updateState() {
            if (!this.visible) {
                return;
            }
            const node = this.state;
            const angle = node.getAngle() % 360;

            // Update reporter
            this.reporter.textContent = `${angle}°`;
        }
    }

}