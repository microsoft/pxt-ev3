

namespace pxsim.visuals {

    export class ColorGridControl extends ControlView<ColorSensorNode> {
        private group: SVGGElement;

        getInnerView() {
            this.group = svg.elt("g") as SVGGElement;
            this.group.setAttribute("transform", `translate(1.02, 1.5) scale(0.8)`)

            const colorIds = ['red', 'yellow', 'blue', 'green', undefined, 'grey'];
            const colors = ['#f12a21', '#ffd01b', '#006db3', '#00934b', undefined, '#6c2d00'];
            const colorValue = [5, 4, 2, 3, 1, 7];

            let cy = -4;
            for (let c = 0; c < colorIds.length; c++) {
                const cx = c % 2 == 0 ? 2.2 : 8.2;
                if (c % 2 == 0) cy += 5;
                if (colorIds[c]) {
                    const circle = pxsim.svg.child(this.group, "circle", { 'class': 'sim-color-grid-circle', 'cx': cx, 'cy': cy, 'r': '2', 'style': `fill: ${colors[c]}` });
                    circle.addEventListener(pointerEvents.down, ev => {
                        this.setColor(colorValue[c]);
                    })
                }
            }

            const whiteCircleWrapper = pxsim.svg.child(this.group, "g", { 'id': 'white-cirlce-wrapper' });
            pxsim.svg.child(whiteCircleWrapper, "circle", { 'class': 'sim-color-grid-circle', 'cx': 2.2, 'cy': '11', 'r': '2', 'style': `fill: #fff` });
            pxsim.svg.child(whiteCircleWrapper, "circle", { 'cx': 2.2, 'cy': '11', 'r': '2', 'style': `fill: none;stroke: #94989b;stroke-width: 0.1px` });
            whiteCircleWrapper.addEventListener(pointerEvents.down, ev => {
                this.setColor(6);
            })
            return this.group;
        }

        getInnerWidth() {
            return 10.2;
        }

        getInnerHeight() {
            return 15;
        }

        private setColor(color: number) {
            const state = this.state;
            state.setColor(color);
        }
    }
}