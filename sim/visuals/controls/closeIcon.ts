

namespace pxsim.visuals {

    export class CloseIconControl extends ControlView<PortNode> {
        private closeGroup: SVGGElement;

        getInnerView() {
            this.closeGroup = svg.elt("g") as SVGGElement;
            this.closeGroup.style.cursor = 'pointer';
            const circleCloseWrapper = pxsim.svg.child(this.closeGroup, "g");
            pxsim.svg.child(circleCloseWrapper, "circle", { 'cx': "16", 'cy': "16", 'r': "16", 'style': "fill: transparent;" });
            pxsim.svg.child(circleCloseWrapper, "circle", { 'cx': "16", 'cy': "16", 'r': "15", 'style': "fill: none;stroke: #a8aaa8;stroke-width: 2px" });
            pxsim.svg.child(this.closeGroup, "rect", { 'x': "10", 'y': "16", 'width': "18", 'height': "2", 'transform': "translate(-9.46 17.41) rotate(-45)", 'style': "fill: #a8aaa8" });
            pxsim.svg.child(this.closeGroup, "rect", { 'x': "18", 'y': "8", 'width': "2", 'height': "18", 'transform': "translate(-9.46 17.41) rotate(-45)", 'style': "fill: #a8aaa8" });

            return this.closeGroup;
        }

        buildDom(): SVGElement {
            this.content = svg.elt("svg", { width: "100%", height: "100%", viewBox:"0 0 32 32"}) as SVGSVGElement;
            this.content.appendChild(this.getInnerView());
            return this.content;
        }

        public getInnerHeight() {
            return 32;
        }

        public getInnerWidth() {
            return 32;
        }
    }

}