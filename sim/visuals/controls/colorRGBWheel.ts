namespace pxsim.visuals {

    export class ColorRGBWheelControl extends ControlView<ColorSensorNode> {
        private group: SVGGElement;
        private colorGradient: SVGLinearGradientElement[] = [];
        private reporter: SVGTextElement[] = [];
        private rect: SVGElement[] = [];
        private printOffsetH = 16;
        private rgbLetters: string[] = ["R", "G", "B"];
        private rectNames: string[] = ["rectR", "rectG", "rectB"];
        private captured: boolean = false;
        private classVal: string;

        getInnerWidth() {
            return 120;
        }

        getInnerHeight() {
            return 192;
        }

        private getReporterHeight() {
            return 70;
        }

        private getSliderWidth() {
            return 24;
        }

        private getSliderHeight() {
            return 100;
        }

        private getMaxValue() {
            return 512;
        }

        private mapValue(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
            return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        }

        updateState() {
            if (!this.visible) return;
            const node = this.state;
            const values = node.getValues();
            let inverseValue: number[] = [];
            for (let i = 0; i < 3; i++) {
                inverseValue[i] = this.getMaxValue() - values[i];
                inverseValue[i] = this.mapValue(inverseValue[i], 0, this.getMaxValue(), 0, 100);
                svg.setGradientValue(this.colorGradient[i], inverseValue[i] + "%");
                this.reporter[i].textContent = this.rgbLetters[i] + ": " + `${parseFloat((values[i]).toString()).toFixed(0)}`;
            }
        }

        updateColorLevel(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            if (!this.classVal) this.classVal = (ev.target as HTMLElement).classList.value;
            let cur = svg.cursorPoint(pt, parent, ev);
            let index = this.rectNames.findIndex(i => i == this.classVal);
            const bBox = this.rect[index].getBoundingClientRect();
            const height = bBox.height;
            let t = Math.max(0, Math.min(1, (height + bBox.top / this.scaleFactor - cur.y / this.scaleFactor) / height));
            const state = this.state;
            let colorsVal = this.state.getValues();
            colorsVal[index] = t * this.getMaxValue();
            state.setColors(colorsVal);
        }

        getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement) {
            this.group = svg.elt("g") as SVGGElement;

            let gc = "gradient-color-" + this.getPort();
            let prevColorGradient: SVGLinearGradientElement[] = [];
            for (let i = 0; i < 3; i++) {
                prevColorGradient[i] = globalDefs.querySelector(`#${gc + "-" + i}`) as SVGLinearGradientElement;
                this.colorGradient[i] = prevColorGradient[i] ? prevColorGradient[i] : svg.linearGradient(globalDefs, gc + "-" + i, false);
                svg.setGradientValue(this.colorGradient[i], "50%");
                svg.setGradientColors(this.colorGradient[i], "black", "yellow");
            }

            let reporterGroup: SVGElement[] = [];
            for (let i = 0; i < 3; i++) {
                reporterGroup[i] = pxsim.svg.child(this.group, "g");

                reporterGroup[i].setAttribute("transform", `translate(${this.getWidth() / 2}, ${18 + this.printOffsetH * i})`);
                this.reporter[i] = pxsim.svg.child(reporterGroup[i], "text", { 'text-anchor': 'middle', 'class': 'sim-text number large inverted', 'style': 'font-size: 18px;' }) as SVGTextElement;
            }
            
            let sliderGroup: SVGElement[] = [];
            for (let i = 0; i < 3; i++) {
                sliderGroup[i] = pxsim.svg.child(this.group, "g");
                const translateX = (this.getWidth() / 2 - this.getSliderWidth() / 2 - 36) + 36 * i;
                sliderGroup[i].setAttribute("transform", `translate(${translateX}, ${this.getReporterHeight()})`);

                this.rect[i] = pxsim.svg.child(sliderGroup[i], "rect", {
                    "width": this.getSliderWidth(),
                    "height": this.getSliderHeight(),
                    "style": `fill: url(#${gc + "-" + i})`
                    }
                );
            }

            let pt = parent.createSVGPoint();
            for (let i = 0; i < 3; i++) {
                touchEvents(this.rect[i], ev => {
                    if (this.captured && (ev as MouseEvent).clientY) {
                        ev.preventDefault();
                        this.updateColorLevel(pt, parent, ev as MouseEvent);
                    }
                }, ev => {
                    this.captured = true;
                    if ((ev as MouseEvent).clientY) {
                        this.rect[i].setAttribute('cursor', '-webkit-grabbing');
                        this.rect[i].setAttribute('class', this.rectNames[i]);
                        this.updateColorLevel(pt, parent, ev as MouseEvent);
                    }
                }, () => {
                    this.captured = false;
                    this.classVal = '';
                    this.rect[i].setAttribute('cursor', '-webkit-grab');
                });
            }

            return this.group;
        }
    }
}