/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {

    export class BrickViewPortrait extends BrickView implements LayoutElement {

        constructor(port: number) {
            super(EV3_SVG, "board", port);

            this.btnids = ["btn_up", "btn_enter", "btn_down", "btn_right", "btn_left", "btn_back"];
        }
    }
}