/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

export interface FieldTurnRatioOptions extends Blockly.FieldCustomOptions {
    min?: string;
    max?: string;
    label?: string;
}

export class FieldTurnRatio extends Blockly.FieldSlider implements Blockly.FieldCustom {
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
    constructor(value_: any, params: FieldTurnRatioOptions, opt_validator?: Function) {
        super(String(value_), '-100', '100', null, '10', 'Speed', opt_validator);
        this.params = params;
        if (this.params['min']) this.min_ = parseFloat(this.params.min);
        if (this.params['max']) this.max_ = parseFloat(this.params.max);
        if (this.params['label']) this.labelText_ = this.params.label;

        (this as any).sliderColor_ = '#a8aaa8';
    }

    private handle_: SVGGElement;
    private gauge_: SVGPathElement;
    private line_: SVGLineElement;
    private arrowSvg_: SVGImageElement;
    private path_: SVGPathElement;

    static HALF = 80;
    static HANDLE_RADIUS = 30;
    static RADIUS = FieldTurnRatio.HALF - FieldTurnRatio.HANDLE_RADIUS - 1;

    createLabelDom_(labelText: string) {
        var labelContainer = document.createElement('div');
        var svg = Blockly.utils.createSvgElement('svg', {
            'xmlns': 'http://www.w3.org/2000/svg',
            'xmlns:html': 'http://www.w3.org/1999/xhtml',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            'version': '1.1',
            'height': (FieldTurnRatio.HALF + FieldTurnRatio.HANDLE_RADIUS) + 'px',
            'width': (FieldTurnRatio.HALF * 2) + 'px'
        }, labelContainer);
        var defs = Blockly.utils.createSvgElement('defs', {}, svg);
        var marker = Blockly.utils.createSvgElement('marker', {
            'id': 'head',
            'orient': "auto",
            'markerWidth': '2',
            'markerHeight': '4',
            'refX': '0.1', 'refY': '1.5'
        }, defs);
        var markerPath = Blockly.utils.createSvgElement('path', {
            'd': 'M0,0 V3 L1.5,1.5 Z',
            'fill': '#f12a21'
        }, marker);

        // Blockly.utils.createSvgElement('circle', {
        //     'cx': FieldTurnRatio.HALF, 'cy': FieldTurnRatio.HALF,
        //     'r': FieldTurnRatio.RADIUS,
        //     'class': 'blocklyAngleCircle',
        //     'style': 'fill: rgb(168, 170, 168)'
        // }, svg);
        // The moving line, x2 and y2 are set in updateGraph_
        // this.line_ = Blockly.utils.createSvgElement('line', {
        //     'x1': FieldTurnRatio.HALF,
        //     'y1': FieldTurnRatio.HALF,
        //     'class': 'blocklyAngleLine'
        // }, svg);
        // The moving line, x2 and y2 are set in updateGraph_
        this.path_ = Blockly.utils.createSvgElement('path', {
            'x1': FieldTurnRatio.HALF,
            'y1': FieldTurnRatio.HALF,
            'marker-end': 'url(#head)',
            'style': 'fill: none; stroke: rgb(168, 170, 168); stroke-width: 10'
        }, svg);
        // The fixed vertical line at the offset
        // var offsetRadians = Math.PI * Blockly.FieldAngle.OFFSET / 180;
        // Blockly.utils.createSvgElement('line', {
        //     'x1': FieldTurnRatio.HALF,
        //     'y1': FieldTurnRatio.HALF,
        //     'x2': FieldTurnRatio.HALF + FieldTurnRatio.RADIUS * Math.cos(offsetRadians),
        //     'y2': FieldTurnRatio.HALF - FieldTurnRatio.RADIUS * Math.sin(offsetRadians),
        //     'class': 'blocklyAngleLine'
        // }, svg);
        // Draw markers around the edge.
        // for (var angle = 0; angle < 360; angle += 15) {
        //     Blockly.utils.createSvgElement('line', {
        //         'x1': FieldTurnRatio.HALF + FieldTurnRatio.RADIUS - 13,
        //         'y1': FieldTurnRatio.HALF,
        //         'x2': FieldTurnRatio.HALF + FieldTurnRatio.RADIUS - 7,
        //         'y2': FieldTurnRatio.HALF,
        //         'class': 'blocklyAngleMarks',
        //         'transform': 'rotate(' + angle + ',' +
        //             FieldTurnRatio.HALF + ',' + FieldTurnRatio.HALF + ')'
        //     }, svg);
        // }
        // Center point
        // Blockly.utils.createSvgElement('circle', {
        //     'cx': FieldTurnRatio.HALF, 'cy': FieldTurnRatio.HALF,
        //     'r': Blockly.FieldAngle.CENTER_RADIUS,
        //     'class': 'blocklyAngleCenterPoint'
        // }, svg);
        // Handle group: a circle and the arrow image
        this.handle_ = Blockly.utils.createSvgElement('g', {}, svg);
        // Blockly.utils.createSvgElement('circle', {
        //     'cx': 0,
        //     'cy': 0,
        //     'r': Blockly.FieldAngle.HANDLE_RADIUS * 2,
        //     'style': 'stroke: #fff; stroke-width: 5; stroke-opacity: 0.25; fill: #fff;'
        // }, this.handle_);
        // this.arrowSvg_ = Blockly.utils.createSvgElement(
        //     'image',
        //     {
        //         'width': Blockly.FieldAngle.ARROW_WIDTH * 2,
        //         'height': Blockly.FieldAngle.ARROW_WIDTH * 2,
        //         'x': -Blockly.FieldAngle.ARROW_WIDTH,
        //         'y': -Blockly.FieldAngle.ARROW_WIDTH
        //     },
        //     this.handle_
        // );
        // this.arrowSvg_.setAttributeNS(
        //     'http://www.w3.org/1999/xlink',
        //     'xlink:href', Blockly.FieldAngle.ARROW_SVG_DATAURI
        // );

        this.updateGraph_();

        // this.speedSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGGElement;
        // pxsim.svg.hydrate(this.speedSVG, {
        //     viewBox: "0 0 200 200"
        // });

        // labelContainer.appendChild(this.speedSVG);

        // const rect = pxsim.svg.child(this.speedSVG, "rect", {
        //     'x': 90, 'y': 100, 'height': 80, 'width': 20, 'style': 'fill: #000'
        // })

        // this.reporter = pxsim.svg.child(this.speedSVG, "text", {
        //     'x': 100, 'y': 80,
        //     'text-anchor': 'middle', 'alignment-baseline': 'middle',
        //     'style': 'font-size: 50px',
        //     'class': 'sim-text inverted number'
        // }) as SVGTextElement;

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

    describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
        var start = this.polarToCartesian(x, y, radius, endAngle);
        var end = this.polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
    }
    polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    updateGraph_() {
        if (!this.handle_) {
            return;
        }
        var value = goog.math.clamp(parseFloat(this.getText()), -100, 100) / 100 * 90;
        var angleDegrees = Number(value) % 360 + Blockly.FieldAngle.OFFSET;
        var angleRadians = goog.math.toRadians(angleDegrees);
        var path = ['M ', FieldTurnRatio.HALF, ',', FieldTurnRatio.HALF];
        var x2 = FieldTurnRatio.HALF;
        var y2 = FieldTurnRatio.HALF;
        if (!isNaN(angleRadians)) {
            var angle1 = goog.math.toRadians(Blockly.FieldAngle.OFFSET);
            var x1 = Math.cos(angle1) * FieldTurnRatio.RADIUS;
            var y1 = Math.sin(angle1) * -FieldTurnRatio.RADIUS;
            if (Blockly.FieldAngle.CLOCKWISE) {
                angleRadians = 2 * angle1 - angleRadians;
            }
            x2 += Math.cos(angleRadians) * FieldTurnRatio.RADIUS;
            y2 -= Math.sin(angleRadians) * FieldTurnRatio.RADIUS;
            // Use large arc only if input value is greater than wrap
            var largeFlag = Math.abs(angleDegrees - Blockly.FieldAngle.OFFSET) > 180 ? 1 : 0;
            var sweepFlag = Number(Blockly.FieldAngle.CLOCKWISE);
            if (angleDegrees < Blockly.FieldAngle.OFFSET) {
                sweepFlag = 1 - sweepFlag; // Sweep opposite direction if less than the offset
            }
            path.push(' l ', x1, ',', y1,
                ' A ', FieldTurnRatio.RADIUS, ',', FieldTurnRatio.RADIUS,
                ' 0 ', largeFlag, ' ', sweepFlag, ' ', x2, ',', y2, ' z');

            // Image rotation needs to be set in degrees
            // if (Blockly.FieldAngle.CLOCKWISE) {
            //     var imageRotation = angleDegrees + 2 * Blockly.FieldAngle.OFFSET;
            // } else {
            //     var imageRotation = -angleDegrees;
            // }
            // this.arrowSvg_.setAttribute('transform', 'rotate(' + ((imageRotation + 45) / 180 * 360) + ')');
        }
        // this.line_.setAttribute('x2', `${x2}`);
        // this.line_.setAttribute('y2', `${y2}`);
        this.handle_.setAttribute('transform', 'translate(' + x2 + ',' + y2 + ')');


        // left wheel
        {
            const x = goog.math.clamp(parseFloat(this.getText()), -100, 100) / 100;
            const theta = x * Math.PI / 2;
            const cx = FieldTurnRatio.HALF;
            const cy = FieldTurnRatio.HALF;
            const gamma = Math.PI - 2 * theta;
            const r = FieldTurnRatio.RADIUS;
            const alpha = 0.2 + Math.abs(x) * 0.5;
            const x1 = 0;
            const y1 = r * alpha;
            const y2 = r * Math.sin(Math.PI / 2 - theta);
            const x2 = r * Math.cos(Math.PI / 2 - theta);
            const y3 = y2 - r * alpha * Math.cos(2 * theta);
            const x3 = x2 - r * alpha * Math.sin(2 * theta);


            const d = `M ${cx} ${cy} C ${cx} ${cy - y1} ${cx + x3} ${cy - y3} ${cx + x2} ${cy - y2}`;
            this.path_.setAttribute('d', d);
        }
    }

    setReadout_(readout: Element, value: string) {
        this.updateSpeed(parseFloat(value));
        // Update reporter
        //this.reporter.textContent = `${value}%`;

        this.updateGraph_();
    }

    private updateSpeed(speed: number) {
        let sign = this.sign(speed);
        speed = (Math.abs(speed) / 100 * 50) + 50;
        if (sign == -1) speed = 50 - speed;
        let c = Math.PI * (90 * 2);
        let pct = ((100 - speed) / 100) * c;
        //this.circleBar.setAttribute('stroke-dashoffset', `${pct}`);
    }

    // A re-implementation of Math.sign (since IE11 doesn't support it)
    private sign(num: number) {
        return num ? num < 0 ? -1 : 1 : 0;
    }
}