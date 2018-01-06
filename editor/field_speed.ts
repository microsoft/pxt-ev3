/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

export interface FieldSpeedOptions extends Blockly.FieldCustomOptions {
    min?: string;
    max?: string;
    label?: string;
}

export class FieldSpeed extends Blockly.FieldSlider implements Blockly.FieldCustom {
    public isFieldCustom_ = true;

    private params: any;

    private speedSVG: SVGElement;
    private circleBar: SVGCircleElement;
    private reporter: SVGTextElement;

    /**
     * Class for a color wheel field.
     * @param {number|string} value The initial content of the field.
     * @param {Function=} opt_validator An optional function that is called
     *     to validate any constraints on what the user entered.  Takes the new
     *     text as an argument and returns either the accepted text, a replacement
     *     text, or null to abort the change.
     * @extends {Blockly.FieldNumber}
     * @constructor
     */
    constructor(value_: any, params: FieldSpeedOptions, opt_validator?: Function) {
        super(String(value_), '-100', '100', null, '10', 'Speed', opt_validator);
        this.params = params;
        if (this.params['min']) this.min_ = parseFloat(this.params.min);
        if (this.params['max']) this.max_ = parseFloat(this.params.max);
        if (this.params['label']) this.labelText_ = this.params.label;

        (this as any).sliderColor_ = '#a8aaa8';
    }

    createLabelDom_(labelText: string) {
        var labelContainer = document.createElement('div');
        this.speedSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGGElement;
        pxsim.svg.hydrate(this.speedSVG, {
            viewBox: "0 0 200 100"
        });

        labelContainer.appendChild(this.speedSVG);

        const outerCircle = pxsim.svg.child(this.speedSVG, "circle", {
            'stroke-dasharray': '565.48', 'stroke-dashoffset': '0',
            'cx': 100, 'cy': 100, 'r': '90', 'style': `fill:transparent; transition: stroke-dashoffset 0.1s linear;`,
            'stroke': '#a8aaa8', 'stroke-width': '1rem'
        }) as SVGCircleElement;
        this.circleBar = pxsim.svg.child(this.speedSVG, "circle", {
            'stroke-dasharray': '565.48', 'stroke-dashoffset': '0',
            'cx': 100, 'cy': 100, 'r': '90', 'style': `fill:transparent; transition: stroke-dashoffset 0.1s linear;`,
            'stroke': '#f12a21', 'stroke-width': '1rem'
        }) as SVGCircleElement;

        this.reporter = pxsim.svg.child(this.speedSVG, "text", {
            'x': 100, 'y': 80,
            'text-anchor': 'middle', 'alignment-baseline': 'middle',
            'style': 'font-size: 50px',
            'class': 'sim-text inverted number'
        }) as SVGTextElement;

        // labelContainer.setAttribute('class', 'blocklyFieldSliderLabel');
        var readout = document.createElement('span');
        readout.setAttribute('class', 'blocklyFieldSliderReadout');
        // var label = document.createElement('span');
        // label.setAttribute('class', 'blocklyFieldSliderLabelText');
        // label.innerHTML = labelText;
        // labelContainer.appendChild(label);
        // labelContainer.appendChild(readout);
        return [labelContainer, readout];
    };

    setReadout_(readout: Element, value: string) {
        this.updateSpeed(parseFloat(value));
        // Update reporter
        this.reporter.textContent = `${value}`;
    }

    private updateSpeed(speed: number) {
        speed = Math.abs(speed);
        speed = speed / 100 * 50;
        speed += 50;
        let c = Math.PI * (90 * 2);
        let pct = ((100 - speed) / 100) * c;
        this.circleBar.setAttribute('stroke-dashoffset', `${pct}`);
    }

}