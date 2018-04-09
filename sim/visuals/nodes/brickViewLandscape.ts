/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {

    export class BrickViewLandscape extends BrickView implements LayoutElement {

        constructor(port: number) {
            super(EV3_LANDSCAPE_SVG, "board-land", port);

            this.btnids = ["btn_up", "btn_enter", "btn_down", "btn_right", "btn_left"];
        }

        protected updateDimensions(width: number, height: number) {
            if (this.content) {
                const currentWidth = this.getInnerWidth();
                const currentHeight = this.getInnerHeight();
                const newHeight = currentHeight / currentWidth * width;
                const newWidth = currentWidth / currentHeight * height;
                this.content.setAttribute('width', `${height > width ? width : newWidth}`);
                this.content.setAttribute('height', `${height > width ? newHeight : height}`);
            }
        }
    }
}