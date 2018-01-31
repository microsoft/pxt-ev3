

namespace pxsim.visuals {

    export class MotorReporterControl extends ControlView<MotorNode> {
        private group: SVGGElement;

        private circleBar: SVGCircleElement;

        private reporter: SVGTextElement;

        getInnerView() {
            this.group = svg.elt("g") as SVGGElement;

            const outerCircle = pxsim.svg.child(this.group, "circle", { 
                'stroke-dasharray': '565.48', 'stroke-dashoffset': '0', 
                'cx': 100, 'cy': 100, 'r': '90', 'style': `fill:transparent; transition: stroke-dashoffset 1s linear;`,
                'stroke': '#a8aaa8', 'stroke-width': '1rem' }) as SVGCircleElement;
            this.circleBar = pxsim.svg.child(this.group, "circle", { 
                'stroke-dasharray': '565.48', 'stroke-dashoffset': '0', 
                'cx': 100, 'cy': 100, 'r': '90', 'style': `fill:transparent; transition: stroke-dashoffset 1s linear;`,
                'stroke': '#f12a21', 'stroke-width': '1rem' }) as SVGCircleElement;

            this.reporter = pxsim.svg.child(this.group, "text", { 
                'x': this.getWidth() / 2, 'y': this.getHeight() / 2, 
                'text-anchor': 'middle', 'dominant-baseline': 'middle',
                'style': 'font-size: 50px', 
                'class': 'sim-text inverted number' }) as SVGTextElement;

            return this.group;
        }

        getInnerWidth() {
            return 200;
        }

        getInnerHeight() {
            return 200;
        }

        updateState() {
            if (!this.visible) {
                return;
            }
            const node = this.state;
            const speed = node.getSpeed();
            this.updateSpeed(speed);

            // Update reporter
            this.reporter.textContent = `${speed}`;
        }

        private updateSpeed(speed: number) {
            let c = Math.PI * (90 * 2);
            speed = Math.abs(speed);
            let pct = ((100 - speed) / 100) * c;
            this.circleBar.setAttribute('stroke-dashoffset', `${pct}`);
        }
    }
}