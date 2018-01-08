/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

export interface FieldUnitValueOptions extends Blockly.FieldCustomOptions {
    min?: string;
    max?: string;
    label?: string;
}

export class FieldUnitValue extends Blockly.FieldNumber implements Blockly.FieldCustom {
    public isFieldCustom_ = true;

    private params: any;

    private unitInput: Blockly.Input;
    private unitValue: string;

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
    constructor(value_: any, params: FieldUnitValueOptions, opt_validator?: Function) {
        super(String(value_), undefined, undefined, undefined, opt_validator);
        this.params = params;
    }

    showEditor_() {
        // Search for "unit" field
        if (this.sourceBlock_
            && this.sourceBlock_.parentBlock_
            && this.sourceBlock_.parentBlock_.inputList
            && this.sourceBlock_.parentBlock_.inputList.length != 0) {
            this.sourceBlock_.parentBlock_.inputList.forEach((input) => {
                input.fieldRow.forEach(field => {
                    if (field.name == "unit") {
                        this.unitInput = input;
                        this.unitValue = field.getValue();
                    }
                })
            })
            if (this.unitInput && this.unitValue) {
                if (this.unitValue == "MoveUnit.Degrees") {
                    this.showDegreesEditor();
                } else {
                    super.showEditor_();
                }
            }
        }
    }

    private handle_: SVGGElement;
    private gauge_: SVGPathElement;
    private line_: SVGLineElement;
    private arrowSvg_: SVGImageElement;

    private mouseDownWrapper_: any;
    private mouseUpWrapper_: any;
    private mouseMoveWrapper_: any;

    private showDegreesEditor() {
        super.showEditor_.call(this);
        // If there is an existing drop-down someone else owns, hide it immediately and clear it.
        Blockly.DropDownDiv.hideWithoutAnimation();
        Blockly.DropDownDiv.clearContent();
        var div = Blockly.DropDownDiv.getContentDiv();
        // Build the SVG DOM.
        var svg = Blockly.utils.createSvgElement('svg', {
            'xmlns': 'http://www.w3.org/2000/svg',
            'xmlns:html': 'http://www.w3.org/1999/xhtml',
            'xmlns:xlink': 'http://www.w3.org/1999/xlink',
            'version': '1.1',
            'height': (Blockly.FieldAngle.HALF * 2) + 'px',
            'width': (Blockly.FieldAngle.HALF * 2) + 'px'
        }, div);
        Blockly.utils.createSvgElement('circle', {
            'cx': Blockly.FieldAngle.HALF, 'cy': Blockly.FieldAngle.HALF,
            'r': Blockly.FieldAngle.RADIUS,
            'class': 'blocklyAngleCircle',
            'fill': this.sourceBlock_.parentBlock_.getColourSecondary(),
            'stroke': this.sourceBlock_.getColourTertiary(),
            'stroke-width': 1
        }, svg);
        this.gauge_ = Blockly.utils.createSvgElement('path',
            { 'class': 'blocklyAngleGauge' }, svg);
        // The moving line, x2 and y2 are set in updateGraph_
        this.line_ = Blockly.utils.createSvgElement('line', {
            'x1': Blockly.FieldAngle.HALF,
            'y1': Blockly.FieldAngle.HALF,
            'class': 'blocklyAngleLine'
        }, svg);
        // The fixed vertical line at the offset
        var offsetRadians = Math.PI * Blockly.FieldAngle.OFFSET / 180;
        Blockly.utils.createSvgElement('line', {
            'x1': Blockly.FieldAngle.HALF,
            'y1': Blockly.FieldAngle.HALF,
            'x2': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS * Math.cos(offsetRadians),
            'y2': Blockly.FieldAngle.HALF - Blockly.FieldAngle.RADIUS * Math.sin(offsetRadians),
            'class': 'blocklyAngleLine'
        }, svg);
        // Draw markers around the edge.
        for (var angle = 0; angle < 360; angle += 15) {
            Blockly.utils.createSvgElement('line', {
                'x1': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS - 13,
                'y1': Blockly.FieldAngle.HALF,
                'x2': Blockly.FieldAngle.HALF + Blockly.FieldAngle.RADIUS - 7,
                'y2': Blockly.FieldAngle.HALF,
                'class': 'blocklyAngleMarks',
                'transform': 'rotate(' + angle + ',' +
                    Blockly.FieldAngle.HALF + ',' + Blockly.FieldAngle.HALF + ')'
            }, svg);
        }
        // Center point
        Blockly.utils.createSvgElement('circle', {
            'cx': Blockly.FieldAngle.HALF, 'cy': Blockly.FieldAngle.HALF,
            'r': Blockly.FieldAngle.CENTER_RADIUS,
            'class': 'blocklyAngleCenterPoint'
        }, svg);
        // Handle group: a circle and the arrow image
        this.handle_ = Blockly.utils.createSvgElement('g', {}, svg);
        Blockly.utils.createSvgElement('circle', {
            'cx': 0,
            'cy': 0,
            'r': Blockly.FieldAngle.HANDLE_RADIUS,
            'class': 'blocklyAngleDragHandle'
        }, this.handle_);
        this.arrowSvg_ = Blockly.utils.createSvgElement(
            'image',
            {
                'width': Blockly.FieldAngle.ARROW_WIDTH,
                'height': Blockly.FieldAngle.ARROW_WIDTH,
                'x': -Blockly.FieldAngle.ARROW_WIDTH / 2,
                'y': -Blockly.FieldAngle.ARROW_WIDTH / 2
            },
            this.handle_
        );
        this.arrowSvg_.setAttributeNS(
            'http://www.w3.org/1999/xlink',
            'xlink:href', Blockly.FieldAngle.ARROW_SVG_DATAURI
        );

        Blockly.DropDownDiv.setColour(this.sourceBlock_.parentBlock_.getColour(),
            this.sourceBlock_.getColourTertiary());
        Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

        this.mouseDownWrapper_ =
            Blockly.bindEvent_(this.handle_, 'mousedown', this, this.onMouseDown);

        this.updateGraph_();
    }

    private onMouseDown() {
        this.mouseMoveWrapper_ = Blockly.bindEvent_(document.body, 'mousemove', this, this.onMouseMove);
        this.mouseUpWrapper_ = Blockly.bindEvent_(document.body, 'mouseup', this, this.onMouseUp);
    };

    private onMouseUp() {
        Blockly.unbindEvent_(this.mouseMoveWrapper_);
        Blockly.unbindEvent_(this.mouseUpWrapper_);
    };

    private onMouseMove(e) {
        e.preventDefault();
        var bBox = this.gauge_.ownerSVGElement.getBoundingClientRect();
        var dx = e.clientX - bBox.left - Blockly.FieldAngle.HALF;
        var dy = e.clientY - bBox.top - Blockly.FieldAngle.HALF;
        var angle = Math.atan(-dy / dx);
        if (isNaN(angle)) {
            // This shouldn't happen, but let's not let this error propagate further.
            return;
        }
        angle = goog.math.toDegrees(angle);
        // 0: East, 90: North, 180: West, 270: South.
        if (dx < 0) {
            angle += 180;
        } else if (dy > 0) {
            angle += 360;
        }
        if (Blockly.FieldAngle.CLOCKWISE) {
            angle = Blockly.FieldAngle.OFFSET + 360 - angle;
        } else {
            angle -= Blockly.FieldAngle.OFFSET;
        }
        if (Blockly.FieldAngle.ROUND) {
            angle = Math.round(angle / Blockly.FieldAngle.ROUND) *
                Blockly.FieldAngle.ROUND;
        }
        angle = this.callValidator(angle);
        Blockly.FieldTextInput.htmlInput_.value = `${angle}`;
        this.setValue(angle);
        this.validate_();
        this.resizeEditor_();
    };

    setText(text: string) {
        switch (this.unitValue) {
            case "MoveUnit.Degrees":
                return this.setTextAngle(text);
            default:
                return super.setText(text);
        }
    }

    private setTextAngle(text: string) {
        Blockly.FieldAngle.superClass_.setText.call(this, text);
        if (!this.textElement_) {
            // Not rendered yet.
            return;
        }
        this.updateGraph_();
        // Cached width is obsolete.  Clear it.
        this.size_.width = 0;
    }

    private updateGraph_() {
        if (!this.gauge_) {
            return;
        }
        var angleDegrees = Number(this.getText()) % 360 + Blockly.FieldAngle.OFFSET;
        var angleRadians = goog.math.toRadians(angleDegrees);
        var path = ['M ', Blockly.FieldAngle.HALF, ',', Blockly.FieldAngle.HALF];
        var x2 = Blockly.FieldAngle.HALF;
        var y2 = Blockly.FieldAngle.HALF;
        if (!isNaN(angleRadians)) {
            var angle1 = goog.math.toRadians(Blockly.FieldAngle.OFFSET);
            var x1 = Math.cos(angle1) * Blockly.FieldAngle.RADIUS;
            var y1 = Math.sin(angle1) * -Blockly.FieldAngle.RADIUS;
            if (Blockly.FieldAngle.CLOCKWISE) {
                angleRadians = 2 * angle1 - angleRadians;
            }
            x2 += Math.cos(angleRadians) * Blockly.FieldAngle.RADIUS;
            y2 -= Math.sin(angleRadians) * Blockly.FieldAngle.RADIUS;
            // Use large arc only if input value is greater than wrap
            var largeFlag = Math.abs(angleDegrees - Blockly.FieldAngle.OFFSET) > 180 ? 1 : 0;
            var sweepFlag = Number(Blockly.FieldAngle.CLOCKWISE);
            if (angleDegrees < Blockly.FieldAngle.OFFSET) {
                sweepFlag = 1 - sweepFlag; // Sweep opposite direction if less than the offset
            }
            path.push(' l ', x1, ',', y1,
                ' A ', Blockly.FieldAngle.RADIUS, ',', Blockly.FieldAngle.RADIUS,
                ' 0 ', largeFlag, ' ', sweepFlag, ' ', x2, ',', y2, ' z');

            // Image rotation needs to be set in degrees
            if (Blockly.FieldAngle.CLOCKWISE) {
                var imageRotation = angleDegrees + 2 * Blockly.FieldAngle.OFFSET;
            } else {
                var imageRotation = -angleDegrees;
            }
            this.arrowSvg_.setAttribute('transform', 'rotate(' + (imageRotation) + ')');
        }
        this.gauge_.setAttribute('d', path.join(''));
        this.line_.setAttribute('x2', `${x2}`);
        this.line_.setAttribute('y2', `${y2}`);
        this.handle_.setAttribute('transform', 'translate(' + x2 + ',' + y2 + ')');
    }

    classValidator(text: string): string {
        switch (this.unitValue) {
            case "MoveUnit.Degrees":
                return this.angleClassValidator(text);
            default:
                return super.classValidator(text);
        }
    }

    angleClassValidator(text: string) {
        if (text === null) {
            return null;
        }
        var n = parseFloat(text) || 0;
        if (isNaN(n)) {
            return null;
        }
        n = n % 360;
        if (n < 0) {
            n += 360;
        }
        if (n > Blockly.FieldAngle.WRAP) {
            n -= 360;
        }
        return String(n);
    }
}