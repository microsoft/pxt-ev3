/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {
    export class TouchSensorView extends ModuleView implements LayoutElement {

        private static RECT_ID = ["touch_gradient4", "touch_gradient3", "touch_gradient2", "touch_gradient1"];
        private static TOUCH_GRADIENT_UNPRESSED = ["linear-gradient-2", "linear-gradient-3", "linear-gradient-4", "linear-gradient-5"];
        private static TOUCH_GRADIENT_PRESSED = ["linear-gradient-6", "linear-gradient-7", "linear-gradient-8", "linear-gradient-9"];

        private unpressedGradient: string;
        private pressedGradient: string;

        private xLinkGradients: string[];

        private static LIGHT_TOUCH_BLACK_COLOR = '#000';
        private static LIGHT_TOUCH_RED_COLOR = '#d42715';

        constructor(port: number) {
            super(TOUCH_SENSOR_SVG, "touch", NodeType.TouchSensor, port);
        }

        protected optimizeForLightMode() {
            (this.content.getElementById(this.normalizeId('touch_box_2-2')) as SVGElement).style.fill = '#a8aaa8';
        }

        public getPaddingRatio() {
            return 1 / 4;
        }

        public hasClick() {
            return false;
        }

        private setAttribute(svgId: string, attribute: string, value: string) {
            const el = this.content.getElementById(svgId);
            if (el) el.setAttribute(attribute, value);
        }

        private setStyleFill(svgId: string, fillUrl: string, lightFill: string) {
            const el = (this.content.getElementById(svgId) as SVGRectElement);
            if (el) el.style.fill = inLightMode() ? lightFill : `url("#${fillUrl}")`;
        }

        public attachEvents() {
            this.content.style.cursor = "pointer";
            const btn = this.content;
            const state = ev3board().getSensor(this.port, DAL.DEVICE_TYPE_TOUCH) as TouchSensorNode;
            pointerEvents.down.forEach(evid => btn.addEventListener(evid, ev => {
                this.setPressed(true);
                state.setPressed(true);
            }))
            btn.addEventListener(pointerEvents.leave, ev => {
                this.setPressed(false);
                state.setPressed(false);
            })
            btn.addEventListener(pointerEvents.up, ev => {
                this.setPressed(false);
                state.setPressed(false);
            })
        }

        private setPressed(pressed: boolean) {
            if (pressed) {
                for (let i = 0; i < 4; i ++) {
                    this.setStyleFill(`${this.normalizeId(TouchSensorView.RECT_ID[i])}`, `${this.normalizeId(TouchSensorView.TOUCH_GRADIENT_PRESSED[i])}`, TouchSensorView.LIGHT_TOUCH_BLACK_COLOR);
                }
            } else {
                for (let i = 0; i < 4; i ++) {
                    this.setStyleFill(`${this.normalizeId(TouchSensorView.RECT_ID[i])}`, `${this.normalizeId(TouchSensorView.TOUCH_GRADIENT_UNPRESSED[i])}`, TouchSensorView.LIGHT_TOUCH_RED_COLOR);
                }
            }
        }
    }
}