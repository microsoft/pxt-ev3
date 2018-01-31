/// <reference path="./moduleView.ts" />

namespace pxsim.visuals {

    export class BrickView extends ModuleView implements LayoutElement {

        private static EV3_SCREEN_ID = "ev3_screen";
        private static EV3_LIGHT_ID = "btn_color";

        private buttons: SVGElement[];
        private light: SVGElement;

        private currentCanvasX = 178;
        private currentCanvasY = 128;

        constructor(port: number) {
            super(EV3_SVG, "board", NodeType.Brick, port);
        }

        protected buildDomCore() {
            // Setup buttons
            const btnids = ["btn_up", "btn_enter", "btn_down", "btn_right", "btn_left", "btn_back"];
            this.buttons = btnids.map(n => this.content.getElementById(this.normalizeId(n)) as SVGElement);
            this.buttons.forEach(b => svg.addClass(b, "sim-button"));

            this.light = this.content.getElementById(this.normalizeId(BrickView.EV3_LIGHT_ID)) as SVGElement;
        }

        private setStyleFill(svgId: string, fillUrl: string) {
            const el = (this.content.getElementById(svgId) as SVGRectElement);
            if (el) el.style.fill = `url("#${fillUrl}")`;
        }

        public hasClick() {
            return false;
        }

        public updateState() {
            this.updateLight();
        }

        public updateThemeCore() {
            let theme = this.theme;
            // svg.fill(this.buttons[0], theme.buttonUps[0]);
            // svg.fill(this.buttons[1], theme.buttonUps[1]);
            // svg.fill(this.buttons[2], theme.buttonUps[2]);
        }

        private lastLightPattern: number = -1;
        private lastLightAnimationId: any = undefined;
        private updateLight() {
            let state = ev3board().getBrickNode().lightState;

            const lightPattern = state.lightPattern;
            if (lightPattern == this.lastLightPattern) return;
            this.lastLightPattern = lightPattern;
            if (this.lastLightAnimationId) {
                cancelAnimationFrame(this.lastLightAnimationId);
                delete this.lastLightAnimationId;
            }
            switch (lightPattern) {
                case 0:  // LED_BLACK
                    this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-black`));
                    //svg.fill(this.light, "#FFF");
                    break;
                case 1:  // LED_GREEN
                    this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-green`));
                    //svg.fill(this.light, "#00ff00");
                    break;
                case 2:  // LED_RED
                    this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-red`));
                    //svg.fill(this.light, "#ff0000");
                    break;
                case 3:  // LED_ORANGE
                    this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-orange`));
                    //svg.fill(this.light, "#FFA500");
                    break;
                case 4:  // LED_GREEN_FLASH
                    this.flashLightAnimation('green');
                    break;
                case 5:  // LED_RED_FLASH
                    this.flashLightAnimation('red');
                    break;
                case 6:  // LED_ORANGE_FLASH
                    this.flashLightAnimation('orange');
                    break;
                case 7:  // LED_GREEN_PULSE
                    this.pulseLightAnimation('green');
                    break;
                case 8:  // LED_RED_PULSE
                    this.pulseLightAnimation('red');
                    break;
                case 9:  // LED_ORANGE_PULSE
                    this.pulseLightAnimation('orange');
                    break;
            }
        }

        private flashLightAnimation(id: string) {
            const pattern = this.lastLightPattern;
            let fps = 3;
            let now;
            let then = Date.now();
            let interval = 1000 / fps;
            let delta;
            let that = this;
            function draw() {
                if (that.lastLightPattern != pattern) return;
                that.lastLightAnimationId = requestAnimationFrame(draw);
                now = pxsim.U.now();
                delta = now - then;
                if (delta > interval) {
                    then = now - (delta % interval);
                    that.flashLightAnimationStep(id);
                }
            }
            draw();
        }

        private flash: boolean;
        private flashLightAnimationStep(id: string) {
            if (this.flash) {
                this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-${id}`));
            } else {
                this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-black`));
            }
            this.flash = !this.flash;
        }


        private pulseLightAnimation(id: string) {
            const pattern = this.lastLightPattern;
            let fps = 8;
            let now;
            let then = Date.now();
            let interval = 1000 / fps;
            let delta;
            let that = this;
            function draw() {
                if (that.lastLightPattern != pattern) return;
                that.lastLightAnimationId = requestAnimationFrame(draw);
                now = pxsim.U.now();
                delta = now - then;
                if (delta > interval) {
                    // update time stuffs
                    then = now - (delta % interval);
                    that.pulseLightAnimationStep(id);
                }
            }
            draw();
        }

        private pulse: number = 0;
        private pulseLightAnimationStep(id: string) {
            switch (this.pulse) {
                case 0: this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-black`)); break;
                case 1: this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-black`)); break;
                case 2: this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-black`)); break;
                case 3: this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-black`)); break;
                case 4: this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-black`)); break;
                case 5: this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-${id}`)); break;
                case 6: this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-${id}`)); break;
                case 7: this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-black`)); break;
                case 8: this.setStyleFill(this.normalizeId(BrickView.EV3_LIGHT_ID), this.normalizeId(`linear-gradient-${id}`)); break;

            }
            this.pulse++;
            if (this.pulse == 9) this.pulse = 0;
        }

        public attachEvents() {
            let bpState = ev3board().getBrickNode().buttonState;
            let stateButtons = bpState.buttons;
            this.buttons.forEach((btn, index) => {
                let button = stateButtons[index];

                btn.addEventListener(pointerEvents.down, ev => {
                    button.setPressed(true);
                    svg.fill(this.buttons[index], this.theme.buttonDown);
                })
                btn.addEventListener(pointerEvents.leave, ev => {
                    button.setPressed(false);
                    svg.fill(this.buttons[index], this.theme.buttonUps[index]);
                })
                btn.addEventListener(pointerEvents.up, ev => {
                    button.setPressed(false);
                    svg.fill(this.buttons[index], this.theme.buttonUps[index]);
                })
            })
        }

        public getScreenBBox() {
            if (!this.content) return undefined;
            const screen = this.content.getElementById(this.normalizeId(BrickView.EV3_SCREEN_ID));
            if (!screen) return undefined;
            return screen.getBoundingClientRect();
        }
    }
}