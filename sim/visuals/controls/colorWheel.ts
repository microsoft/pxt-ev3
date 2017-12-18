

namespace pxsim.visuals {

    export class ColorWheelControl extends ControlView<ColorSensorNode> {
        private group: SVGGElement;

        private static COLOR_DARK = 1;
        private static COLOR_LIGHT = 99;

        getInnerView() {
            this.group = svg.elt("g") as SVGGElement;
            this.group.setAttribute("transform", `translate(12, ${this.getHeight() / 2 - 15}) scale(2.5)`)

            const circle = pxsim.svg.child(this.group, "g");
            const lightHalf = pxsim.svg.child(circle, "path", { 'class': 'sim-color-wheel-half', 'd': 'M19,28.76a11.71,11.71,0,1,1,4.58-.92A11.74,11.74,0,0,1,19,28.76Z', 'transform': 'translate(-6.5 -4.5)', 'style': `fill: #fff;stroke: #000;stroke-miterlimit: 10` });
            pxsim.svg.child(circle, "path", { 'd': 'M19,28.52a11.42,11.42,0,0,0,4.48-.9,11.75,11.75,0,0,0,3.67-2.47,11.55,11.55,0,0,0,2.46-3.67,11.48,11.48,0,0,0,0-9,11.41,11.41,0,0,0-6.13-6.13,11.48,11.48,0,0,0-9,0,11.41,11.41,0,0,0-6.13,6.13,11.48,11.48,0,0,0,0,9,11.55,11.55,0,0,0,2.46,3.67,11.75,11.75,0,0,0,3.67,2.47,11.42,11.42,0,0,0,4.48.9M19,29A12,12,0,1,1,31,17,12,12,0,0,1,19,29Z', 'transform': 'translate(-6.5 -4.5)', 'style': `fill: #fff;stroke: #000;stroke-miterlimit: 10` });
            lightHalf.addEventListener(pointerEvents.down, ev => {
                this.setColor(ColorWheelControl.COLOR_LIGHT);
            })
            const darkHalf = pxsim.svg.child(this.group, "path", { 'class': 'sim-color-wheel-half', 'd': 'M19,5c.16,8.54,0,14.73,0,24A12,12,0,0,1,19,5Z', 'transform': 'translate(-6.5 -4.5)' });
            darkHalf.addEventListener(pointerEvents.down, ev => {
                this.setColor(ColorWheelControl.COLOR_DARK);
            })
            return this.group;
        }

        private setColor(color: number) {
            const state = this.state;
            state.setColor(color);
        }
    }

}