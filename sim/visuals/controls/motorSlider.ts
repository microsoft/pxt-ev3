

namespace pxsim.visuals {

    export class MotorSliderControl extends ControlView<MotorNode> {
        private group: SVGGElement;
        private gradient: SVGLinearGradientElement;
        private slider: SVGGElement;

        private reporter: SVGTextElement;

        private circleBar: SVGCircleElement;
        private dial: SVGGElement;

        private static SLIDER_RADIUS = 100;

        private internalSpeed: number = 0;

        getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement) {
            this.group = svg.elt("g") as SVGGElement;
            const sliderHeight = 250;

            const slider = pxsim.svg.child(this.group, 'g', { 'transform': 'translate(25,25)' })
            const outerCircle = pxsim.svg.child(slider, "circle", {
                'stroke-dasharray': '565.48', 'stroke-dashoffset': '0',
                'cx': 100, 'cy': 100, 'r': '90', 'style': `fill:transparent;`,
                'stroke': '#a8aaa8', 'stroke-width': '1rem'
            }) as SVGCircleElement;
            this.circleBar = pxsim.svg.child(slider, "circle", {
                'stroke-dasharray': '565.48', 'stroke-dashoffset': '0',
                'cx': 100, 'cy': 100, 'r': '90', 'style': `fill:transparent;`,
                'stroke': '#f12a21', 'stroke-width': '1rem', 'transform': 'rotate(-90 100 100)'
            }) as SVGCircleElement;

            this.reporter = pxsim.svg.child(this.group, "text", {
                'x': this.getInnerWidth() / 2, 'y': sliderHeight / 2,
                'text-anchor': 'middle', 'alignment-baseline': 'middle',
                'style': 'font-size: 50px',
                'class': 'sim-text inverted number'
            }) as SVGTextElement;

            this.dial = pxsim.svg.child(slider, "g", { 'cursor': '-webkit-grab' }) as SVGGElement;
            const handleInner = pxsim.svg.child(this.dial, "g");
            pxsim.svg.child(handleInner, "circle", { 'cx': 0, 'cy': 0, 'r': 30, 'style': 'fill: #f12a21;' });
            pxsim.svg.child(handleInner, "circle", { 'cx': 0, 'cy': 0, 'r': 29.5, 'style': 'fill: none;stroke: #b32e29' });

            // Add move buttons
            const moveBtnRadius = 40;
            const leftMoveG = pxsim.svg.child(this.group, 'g');
            const leftMove = pxsim.svg.child(leftMoveG, 'circle', {
                'cx': moveBtnRadius, 'cy': sliderHeight + moveBtnRadius,
                'r': moveBtnRadius, 'style': 'fill: #a8aaa8', 'class': 'sim-motor-btn'
            });
            let leftMoveFrame: number;
            touchEvents(leftMove, ev => {
                // move
            }, ev => {
                if (leftMoveFrame) cancelAnimationFrame(leftMoveFrame);
                let setSpeed = () => {
                    leftMoveFrame = requestAnimationFrame(() => {
                        this.state.setSpeedAsInput(-1 * this.internalSpeed);
                        setSpeed();
                    })
                }
                setSpeed();
            }, () => {
                if (leftMoveFrame) cancelAnimationFrame(leftMoveFrame);
            }, () => {
                if (leftMoveFrame) cancelAnimationFrame(leftMoveFrame);
            })

            const rightMoveG = pxsim.svg.child(this.group, 'g');
            const rightMove = pxsim.svg.child(rightMoveG, 'circle', {
                'cx': this.getWidth() - moveBtnRadius, 'cy': sliderHeight + moveBtnRadius,
                'r': moveBtnRadius, 'style': 'fill: #a8aaa8', 'class': 'sim-motor-btn'
            });
            let rightMoveFrame: number;
            touchEvents(rightMove, ev => {
                // move
            }, ev => {
                if (rightMoveFrame) cancelAnimationFrame(rightMoveFrame);
                let setSpeed = () => {
                    rightMoveFrame = requestAnimationFrame(() => {
                        this.state.setSpeedAsInput(this.internalSpeed);
                        setSpeed();
                    })
                }
                setSpeed();
            }, () => {
                if (rightMoveFrame) cancelAnimationFrame(rightMoveFrame);
            }, () => {
                if (rightMoveFrame) cancelAnimationFrame(rightMoveFrame);
            })

            this.updateInternalSpeed();

            let pt = parent.createSVGPoint();
            let captured = false;

            const dragSurface = svg.child(this.group, "rect", {
                x: 0,
                y: 0,
                width: this.getInnerWidth(),
                height: sliderHeight,
                opacity: 0,
                cursor: '-webkit-grab'
            })

            touchEvents(dragSurface, ev => {
                if (captured && (ev as MouseEvent).clientY != undefined) {
                    ev.preventDefault();
                    this.updateSliderValue(pt, parent, ev as MouseEvent);
                }
            }, ev => {
                captured = true;
                if ((ev as MouseEvent).clientY != undefined) {
                    this.dial.setAttribute('cursor', '-webkit-grabbing');
                    this.updateSliderValue(pt, parent, ev as MouseEvent);
                }
            }, () => {
                captured = false;
                this.dial.setAttribute('cursor', '-webkit-grab');
            }, () => {
                captured = false;
                this.dial.setAttribute('cursor', '-webkit-grab');
            })

            return this.group;
        }

        getInnerWidth() {
            return 250;
        }

        getInnerHeight() {
            return 330;
        }

        private lastPosition: number;
        private prevVal: number;
        private updateSliderValue(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            let cur = svg.cursorPoint(pt, parent, ev);
            const coords = {
                x: cur.x / this.scaleFactor - this.left / this.scaleFactor,
                y: cur.y / this.scaleFactor - this.top / this.scaleFactor
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
            const value = Math.abs(Math.ceil((deg % 360) / 360 * this.getMax()));

            this.internalSpeed = value;
            this.updateInternalSpeed();

            this.prevVal = deg;
            this.lastPosition = cur.x;
        }

        private updateInternalSpeed() {
            let speed = this.internalSpeed;

            // Update speed on circle bar
            let c = Math.PI * (90 * 2);
            speed = Math.abs(speed);
            let pct = ((100 - speed) / 100) * c;
            this.circleBar.setAttribute('stroke-dashoffset', `${pct}`);

            // Update reporter text
            this.reporter.textContent = `${speed}`;

            // Update dial position
            const deg = speed / this.getMax() * 360; // degrees
            const radius = MotorSliderControl.SLIDER_RADIUS;
            const dialRadius = 5;
            const x = Math.ceil((radius - dialRadius) * Math.sin(deg * Math.PI / 180)) + radius;
            const y = Math.ceil((radius - dialRadius) * -Math.cos(deg * Math.PI / 180)) + radius;
            this.dial.setAttribute('transform', `translate(${x}, ${y})`);
        }

        private getMin() {
            return 0;
        }

        private getMax() {
            return 100;
        }
    }

}