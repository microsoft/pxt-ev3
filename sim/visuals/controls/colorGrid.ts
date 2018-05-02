

namespace pxsim.visuals {

    export class ColorGridControl extends ControlView<ColorSensorNode> {
        private group: SVGGElement;

        private static colorIds = ['red', 'yellow', 'blue', 'green', 'black', 'grey', 'white'];
        private static colorValue = [5, 4, 2, 3, 1, 7, 6];

        private colorDivs: Element[] = [];

        getInnerView() {
            this.group = svg.elt("g") as SVGGElement;
            this.group.setAttribute("transform", `translate(2, 2.5) scale(0.6)`)

            const colors = ['#f12a21', '#ffd01b', '#006db3', '#00934b', '#000', '#6c2d00'];
            const colorIds = ['red', 'yellow', 'blue', 'green', 'black', 'grey'];

            let cy = -4;
            for (let c = 0; c < colorIds.length; c++) {
                const cx = c % 2 == 0 ? 2.2 : 7.5;
                if (c % 2 == 0) cy += 5;
                if (colorIds[c]) {
                    const circle = pxsim.svg.child(this.group, "circle", { 
                        'class': `sim-color-grid-circle sim-color-grid-${colorIds[c]}`,
                        'cx': cx, 'cy': cy, 'r': '2', 'style': `fill: ${colors[c]}` });
                    this.colorDivs.push(circle);
                    pointerEvents.down.forEach(evid => circle.addEventListener(evid, ev => {
                        this.setColor(ColorGridControl.colorValue[c]);
                    }));
                }
            }

            const whiteCircleWrapper = pxsim.svg.child(this.group, "g", { 'id': 'white-cirlce-wrapper' });
            const circle = pxsim.svg.child(whiteCircleWrapper, "circle", { 'class': 'sim-color-grid-circle sim-color-grid-white', 'cx': 2.2, 'cy': '16', 'r': '2', 'style': `fill: #fff` });
            this.colorDivs.push(circle);
            pxsim.svg.child(whiteCircleWrapper, "circle", { 'cx': 2.2, 'cy': '16', 'r': '2', 'style': `fill: none;stroke: #94989b;stroke-width: 0.1px` });
            pointerEvents.down.forEach(evid => whiteCircleWrapper.addEventListener(evid, ev => {
                this.setColor(6);
            }));
            return this.group;
        }

        getInnerWidth() {
            return 9.5;
        }

        getInnerHeight() {
            return 15;
        }

        public updateState() {
            if (!this.visible) {
                return;
            }
            const node = this.state;
            const color = node.getValue();

            for (let c = 0; c < ColorGridControl.colorValue.length; c++) {
                const colorId = ColorGridControl.colorIds[c];
                const colorValue = ColorGridControl.colorValue[c];
                const colorDiv = this.colorDivs[c] as HTMLElement;

                if (colorValue == color) {
                    pxsim.U.addClass(colorDiv, 'sim-color-selected');
                } else {
                    pxsim.U.removeClass(colorDiv, 'sim-color-selected');
                }
            }
        }

        private setColor(color: number) {
            const state = this.state;
            const currentColor = state.getValue();
            if (currentColor == color) {
                state.setColor(0);
            } else {
                state.setColor(color);
            }
        }
    }
}