namespace pxsim.visuals {

    export class ColorRGBWheelControl extends ControlView<ColorSensorNode> {
        private group: SVGGElement;
        private colorGradient: SVGLinearGradientElement;
        private reporter: SVGTextElement[] = [];
        private rect: SVGElement[] = [];

        private printOffsetH = 18;

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
            return 1023;
        }

        private mapValue(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
            return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        }

        updateState() {
            if (!this.visible) return;
            const node = this.state;
            const value = node.getValue();
            let inverseValue = this.getMaxValue() - value;
            inverseValue = this.mapValue(inverseValue, 0, 1023, 0, 100);
            svg.setGradientValue(this.colorGradient, inverseValue + "%");
            this.reporter[0].textContent = "R: " + `${parseFloat((value).toString()).toFixed(0)}`;
            this.reporter[1].textContent = "G: " + `${parseFloat((value).toString()).toFixed(0)}`;
            this.reporter[2].textContent = "B: " + `${parseFloat((value).toString()).toFixed(0)}`;
        }

        updateColorLevel(pt: SVGPoint, parent: SVGSVGElement, ev: MouseEvent) {
            let cur = svg.cursorPoint(pt, parent, ev);
            const bBox = this.rect[0].getBoundingClientRect();
            const height = bBox.height;
            let t = Math.max(0, Math.min(1, (height + bBox.top / this.scaleFactor - cur.y / this.scaleFactor) / height));
            const state = this.state;
            state.setColor(t * this.getMaxValue());
        }

        getInnerView(parent: SVGSVGElement, globalDefs: SVGDefsElement) {
            this.group = svg.elt("g") as SVGGElement;

            let gc = "gradient-color-" + this.getPort();
            const prevColorGradient = globalDefs.querySelector(`#${gc}`) as SVGLinearGradientElement;
            this.colorGradient = prevColorGradient ? prevColorGradient : svg.linearGradient(globalDefs, gc, false);
            svg.setGradientValue(this.colorGradient, "50%");
            svg.setGradientColors(this.colorGradient, "black", "yellow");

            let pt = parent.createSVGPoint();
            let captured: boolean[] = [false, false, false];

            let reporterGroup: SVGElement[] = [];
            for (let i = 0; i < 3; i++) {
                reporterGroup[i] = pxsim.svg.child(this.group, "g");

                console.log(`reporterGroup[${i}]:`);
                console.log(reporterGroup[i]);

                reporterGroup[i].setAttribute("transform", `translate(${this.getWidth() / 2}, ${18 + this.printOffsetH * i})`);
                this.reporter[i] = pxsim.svg.child(reporterGroup[i], "text", { 'text-anchor': 'middle', 'class': 'sim-text number large inverted', 'style': 'font-size: 18px;' }) as SVGTextElement;
                
                console.log(`this.reporter[${i}]:`);
                console.log(this.reporter[0]);
            }
            
            let sliderGroup: SVGElement[] = [];
            for (let i = 0; i < 3; i++) {
                sliderGroup[i] = pxsim.svg.child(this.group, "g");
                const translateX = (this.getWidth() / 2 - this.getSliderWidth() / 2 - 36) + 36 * i;
                sliderGroup[i].setAttribute("transform", `translate(${translateX}, ${this.getReporterHeight()})`);

                console.log(`sliderGroup[${i}]:`);
                console.log(sliderGroup[i]);

                this.rect[i] = pxsim.svg.child(sliderGroup[i], "rect", {
                    "width": this.getSliderWidth(),
                    "height": this.getSliderHeight(),
                    "style": `fill: url(#${gc})`
                    }
                );

                console.log(`this.rect[${i}]:`);
                console.log(this.rect[i]);
            }

            for (let i = 0; i < 3; i++) {
                touchEvents(this.rect[i], ev => {
                    if (captured[i] && (ev as MouseEvent).clientY) {
                        ev.preventDefault();
                        this.updateColorLevel(pt, parent, ev as MouseEvent);
                    }
                }, ev => {
                    captured[i] = true;
                    if ((ev as MouseEvent).clientY) {
                        this.rect[i].setAttribute('cursor', '-webkit-grabbing');
                        this.updateColorLevel(pt, parent, ev as MouseEvent);
                    }
                }, () => {
                    captured[i] = false;
                    this.rect[i].setAttribute('cursor', '-webkit-grab');
                });
            }

            return this.group;
        }
    }
}