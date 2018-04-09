/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

export interface FieldMotorsOptions extends Blockly.FieldCustomDropdownOptions {

}

export class FieldMotors extends Blockly.FieldDropdown implements Blockly.FieldCustom {
    public isFieldCustom_ = true;

    private box2_: SVGRectElement;
    private textElement2_: SVGTextElement;
    private arrow2_: SVGImageElement;

    // Width in pixels
    protected itemWidth_: number;

    // Number of rows to display (if there are extra rows, the picker will be scrollable)
    protected maxRows_: number;

    protected backgroundColour_: string;
    protected itemColour_: string;
    protected borderColour_: string;

    private isFirst_: boolean; // which of the two dropdowns is selected

    constructor(text: string, options: FieldMotorsOptions, validator?: Function) {
        super(options.data, validator);

        this.itemWidth_ = 75;
        this.backgroundColour_ = pxtblockly.parseColour(options.colour);
        this.itemColour_ = "rgba(255, 255, 255, 0.6)";
        this.borderColour_ = Blockly.PXTUtils.fadeColour(this.backgroundColour_, 0.4, false);
    }

    init() {
        if (this.fieldGroup_) {
            // Field has already been initialized once.
            return;
        }
        // Add dropdown arrow: "option ▾" (LTR) or "▾ אופציה" (RTL)
        // Positioned on render, after text size is calculated.
        /** @type {Number} */
        (this as any).arrowSize_ = 12;
        /** @type {Number} */
        (this as any).arrowX_ = 0;
        /** @type {Number} */
        this.arrowY_ = 11;
        this.arrow_ = Blockly.utils.createSvgElement('image', {
            'height': (this as any).arrowSize_ + 'px',
            'width': (this as any).arrowSize_ + 'px'
        });
        this.arrow_.setAttributeNS('http://www.w3.org/1999/xlink',
            'xlink:href', (Blockly.FieldDropdown as any).DROPDOWN_SVG_DATAURI);

        this.arrow2_ = Blockly.utils.createSvgElement('image', {
            'height': (this as any).arrowSize_ + 'px',
            'width': (this as any).arrowSize_ + 'px'
        });
        this.arrow2_.setAttributeNS('http://www.w3.org/1999/xlink',
            'xlink:href', (Blockly.FieldDropdown as any).DROPDOWN_SVG_DATAURI);
        (this as any).className_ += ' blocklyDropdownText';

        // Build the DOM.
        this.fieldGroup_ = Blockly.utils.createSvgElement('g', {}, null);
        if (!this.visible_) {
            (this.fieldGroup_ as any).style.display = 'none';
        }
        // Adjust X to be flipped for RTL. Position is relative to horizontal start of source block.
        var size = this.getSize();
        var fieldX = (this.sourceBlock_.RTL) ? -size.width / 2 : size.width / 2;
        /** @type {!Element} */
        this.textElement_ = Blockly.utils.createSvgElement('text',
            {
                'class': (this as any).className_,
                'x': fieldX,
                'dy': '0.7ex',
                'y': size.height / 2
            },
            this.fieldGroup_);
        fieldX += 10; // size of first group.
        this.textElement2_ = Blockly.utils.createSvgElement('text',
            {
                'class': (this as any).className_,
                'x': fieldX,
                'dy': '0.7ex',
                'y': this.size_.height / 2
            },
            this.fieldGroup_);

        this.updateEditable();
        this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);
        // Force a render.
        this.render_();
        this.size_.width = 0;
        (this as any).mouseDownWrapper_ =
            Blockly.bindEventWithChecks_((this as any).getClickTarget_(), 'mousedown', this,
                (this as any).onMouseDown_);

        // Add second dropdown 
        if (this.shouldShowRect_()) {
            this.box_ = Blockly.utils.createSvgElement('rect', {
                'rx': (Blockly.BlockSvg as any).CORNER_RADIUS,
                'ry': (Blockly.BlockSvg as any).CORNER_RADIUS,
                'x': 0,
                'y': 0,
                'width': this.size_.width,
                'height': this.size_.height,
                'stroke': this.sourceBlock_.getColourTertiary(),
                'fill': this.sourceBlock_.getColour(),
                'class': 'blocklyBlockBackground',
                'fill-opacity': 1
            }, null);
            this.fieldGroup_.insertBefore(this.box_, this.textElement_);
            this.box2_ = Blockly.utils.createSvgElement('rect', {
                'rx': (Blockly.BlockSvg as any).CORNER_RADIUS,
                'ry': (Blockly.BlockSvg as any).CORNER_RADIUS,
                'x': 0,
                'y': 0,
                'width': this.size_.width,
                'height': this.size_.height,
                'stroke': this.sourceBlock_.getColourTertiary(),
                'fill': this.sourceBlock_.getColour(),
                'class': 'blocklyBlockBackground',
                'fill-opacity': 1
            }, null);
            this.fieldGroup_.insertBefore(this.box2_, this.textElement2_);
        }

        // Force a reset of the text to add the arrow.
        var text = this.text_;
        this.text_ = null;
        this.setText(text);
    }

    getFirstDisplayText_() {
        return this.getFirstValue(this.text_);
    }

    getFirstValue(text: string) {
        // Get first set of words up until last space
        return this.normalizeText_(text.substring(0, text.lastIndexOf(' ')));
    }

    getSecondDisplayText_() {
        return this.getSecondValue(this.text_);
    }

    getSecondValue(text: string) {
        // Get last word
        return this.normalizeText_(text.match(/\S*$/)[0]);
    }

    private normalizeText_(text: string) {
        if (!text) {
            // Prevent the field from disappearing if empty.
            return Blockly.Field.NBSP;
        }
        if (text.length > this.maxDisplayLength) {
            // Truncate displayed string and add an ellipsis ('...').
            text = text.substring(0, this.maxDisplayLength - 2) + '\u2026';
        }
        // Replace whitespace with non-breaking spaces so the text doesn't collapse.
        text = text.replace(/\s/g, Blockly.Field.NBSP);
        if (this.sourceBlock_.RTL) {
            // The SVG is LTR, force text to be RTL.
            text += '\u200F';
        }
        return text;
    }

    updateTextNode2_() {
        if (!this.textElement2_) {
            // Not rendered yet.
            return;
        }
        var text = this.text_;
        if (text.length > this.maxDisplayLength) {
            // Truncate displayed string and add an ellipsis ('...').
            text = text.substring(0, this.maxDisplayLength - 2) + '\u2026';
            // Add special class for sizing font when truncated
            this.textElement2_.setAttribute('class', (this as any).className_ + ' blocklyTextTruncated');
        } else {
            this.textElement2_.setAttribute('class', (this as any).className_);
        }
        // Empty the text element.
        goog.dom.removeChildren(/** @type {!Element} */(this.textElement2_));
        // Replace whitespace with non-breaking spaces so the text doesn't collapse.
        text = text.replace(/\s/g, Blockly.Field.NBSP);
        if (this.sourceBlock_.RTL && text) {
            // The SVG is LTR, force text to be RTL.
            text += '\u200F';
        }
        if (!text) {
            // Prevent the field from disappearing if empty.
            text = Blockly.Field.NBSP;
        }
        var textNode = document.createTextNode(text);
        this.textElement2_.appendChild(textNode);

        // Cached width is obsolete.  Clear it.
        this.size_.width = 0;
    };

    setText(text: string) {
        if (text === null || text === this.text_) {
            // No change if null.
            return;
        }
        if (text.indexOf(' ') == -1) text = `large motors ${text}`;
        this.text_ = text;
        this.updateTextNode_();
        this.updateTextNode2_();

        if (this.textElement_) {
            this.textElement_.parentNode.appendChild(this.arrow_);
        }
        if (this.textElement2_) {
            this.textElement2_.parentNode.appendChild(this.arrow2_);
        }
        if (this.sourceBlock_ && this.sourceBlock_.rendered) {
            this.sourceBlock_.render();
            this.sourceBlock_.bumpNeighbours_();
        }
    }

    positionArrow2(start: number, x: number) {
        if (!this.arrow2_) {
            return 0;
        }

        var addedWidth = 0;
        if (this.sourceBlock_.RTL) {
            (this as any).arrow2X_ = (this as any).arrowSize_ - (Blockly.BlockSvg as any).DROPDOWN_ARROW_PADDING;
            addedWidth = (this as any).arrowSize_ + (Blockly.BlockSvg as any).DROPDOWN_ARROW_PADDING;
        } else {
            (this as any).arrow2X_ = x + (Blockly.BlockSvg as any).DROPDOWN_ARROW_PADDING / 2;
            addedWidth = (this as any).arrowSize_ + (Blockly.BlockSvg as any).DROPDOWN_ARROW_PADDING;
        }
        if (this.box_) {
            // Bump positioning to the right for a box-type drop-down.
            (this as any).arrow2X_ += Blockly.BlockSvg.BOX_FIELD_PADDING;
        }
        (this as any).arrow2X_ += start;
        this.arrow2_.setAttribute('transform',
            'translate(' + (this as any).arrow2X_ + ',' + this.arrowY_ + ')'
        );
        return addedWidth;
    };

    updateWidth() {
        // Calculate width of field
        var width = Blockly.Field.getCachedWidth(this.textElement_);
        var width2 = Blockly.Field.getCachedWidth(this.textElement2_);

        // Add padding to left and right of text.
        if (this.EDITABLE) {
            width += Blockly.BlockSvg.EDITABLE_FIELD_PADDING;
            width2 += Blockly.BlockSvg.EDITABLE_FIELD_PADDING;
        }

        // Adjust width for drop-down arrow.
        this.arrowWidth_ = 0;
        if (this.positionArrow) {
            this.arrowWidth_ = this.positionArrow(width);
            width += this.arrowWidth_;
        }

        // Add padding to any drawn box.
        if (this.box_) {
            width += 2 * Blockly.BlockSvg.BOX_FIELD_PADDING;
        }

        // Adjust width for second drop-down arrow.
        (this as any).arrowWidth2_ = 0;
        if (this.positionArrow2) {
            (this as any).arrowWidth2_ = this.positionArrow2(width + Blockly.BlockSvg.BOX_FIELD_PADDING, width2);
            width2 += (this as any).arrowWidth2_;
        }

        // Add padding to any drawn box.
        if (this.box2_) {
            width2 += 2 * Blockly.BlockSvg.BOX_FIELD_PADDING;
        }

        // Set width of the field.
        this.size_.width = width + Blockly.BlockSvg.BOX_FIELD_PADDING + width2;
        (this as any).width1 = width;
        (this as any).width2 = width2;
    };

    render_() {
        if (this.visible_ && this.textElement_) {
            goog.dom.removeChildren(/** @type {!Element} */(this.textElement_));
            goog.dom.removeChildren(/** @type {!Element} */(this.textElement2_));
            // First dropdown
            const textNode1 = document.createTextNode(this.getFirstDisplayText_());
            this.textElement_.appendChild(textNode1);

            // Second dropdown
            if (this.textElement2_) {
                const textNode2 = document.createTextNode(this.getSecondDisplayText_());
                this.textElement2_.appendChild(textNode2);
            }
            this.updateWidth();

            // Update text centering, based on newly calculated width.
            let centerTextX = ((this as any).width1 - this.arrowWidth_) / 2;
            if (this.sourceBlock_.RTL) {
                centerTextX += this.arrowWidth_;
            }

            // In a text-editing shadow block's field,
            // if half the text length is not at least center of
            // visible field (FIELD_WIDTH), center it there instead,
            // unless there is a drop-down arrow.
            if (this.sourceBlock_.isShadow() && !this.positionArrow) {
                let minOffset = (Blockly.BlockSvg as any).FIELD_WIDTH / 2;
                if (this.sourceBlock_.RTL) {
                    // X position starts at the left edge of the block, in both RTL and LTR.
                    // First offset by the width of the block to move to the right edge,
                    // and then subtract to move to the same position as LTR.
                    let minCenter = (this as any).width1 - minOffset;
                    centerTextX = Math.min(minCenter, centerTextX);
                } else {
                    // (width / 2) should exceed Blockly.BlockSvg.FIELD_WIDTH / 2
                    // if the text is longer.
                    centerTextX = Math.max(minOffset, centerTextX);
                }
            }

            // Apply new text element x position.
            var width = Blockly.Field.getCachedWidth(this.textElement_);
            var newX = centerTextX - width / 2;
            this.textElement_.setAttribute('x', `${newX}`);

            // Update text centering, based on newly calculated width.
            let centerTextX2 = ((this as any).width2 - (this as any).arrowWidth2_) / 2;
            if (this.sourceBlock_.RTL) {
                centerTextX2 += (this as any).arrowWidth2_;
            }

            // In a text-editing shadow block's field,
            // if half the text length is not at least center of
            // visible field (FIELD_WIDTH), center it there instead,
            // unless there is a drop-down arrow.
            if (this.sourceBlock_.isShadow() && !this.positionArrow2) {
                let minOffset = (Blockly.BlockSvg as any).FIELD_WIDTH / 2;
                if (this.sourceBlock_.RTL) {
                    // X position starts at the left edge of the block, in both RTL and LTR.
                    // First offset by the width of the block to move to the right edge,
                    // and then subtract to move to the same position as LTR.
                    let minCenter = (this as any).width2 - minOffset;
                    centerTextX2 = Math.min(minCenter, centerTextX2);
                } else {
                    // (width / 2) should exceed Blockly.BlockSvg.FIELD_WIDTH / 2
                    // if the text is longer.
                    centerTextX2 = Math.max(minOffset, centerTextX2);
                }
            }

            // Apply new text element x position.
            var width2 = Blockly.Field.getCachedWidth(this.textElement2_);
            var newX2 = centerTextX2 - width2 / 2;
            this.textElement2_.setAttribute('x', `${newX2 + (this as any).width1 + Blockly.BlockSvg.BOX_FIELD_PADDING}`);
        }

        // Update any drawn box to the correct width and height.
        if (this.box_) {
            this.box_.setAttribute('width', `${(this as any).width1}`);
            this.box_.setAttribute('height', `${this.size_.height}`);
        }

        // Update any drawn box to the correct width and height.
        if (this.box2_) {
            this.box2_.setAttribute('x', `${(this as any).width1 + Blockly.BlockSvg.BOX_FIELD_PADDING}`);
            this.box2_.setAttribute('width', `${(this as any).width2}`);
            this.box2_.setAttribute('height', `${this.size_.height}`);
        }
    };

    showEditor_(e?: MouseEvent) {
        // If there is an existing drop-down we own, this is a request to hide the drop-down.
        if (Blockly.DropDownDiv.hideIfOwner(this)) {
            return;
        }
        this.isFirst_ = e.clientX - this.getScaledBBox_().left < ((this as any).width1 * this.sourceBlock_.workspace.scale);
        // If there is an existing drop-down someone else owns, hide it immediately and clear it.
        Blockly.DropDownDiv.hideWithoutAnimation();
        Blockly.DropDownDiv.clearContent();
        // Populate the drop-down with the icons for this field.
        let dropdownDiv = Blockly.DropDownDiv.getContentDiv();
        let contentDiv = document.createElement('div');
        // Accessibility properties
        contentDiv.setAttribute('role', 'menu');
        contentDiv.setAttribute('aria-haspopup', 'true');
        let options = this.getOptions();

        // Hashmap of options
        let opts = {};
        let conts = {};
        let vals = {};
        for (let opt in options) {
            let text = options[opt][0].alt ? options[opt][0].alt : options[opt][0];
            if (text.indexOf(' ') == -1) {
                // Patch dual motors as they don't have prefixes.
                text = `large motors ${text}`
                if (options[opt][0].alt) options[opt][0].alt = text;
            }
            const value = options[opt][1];
            const firstValue = this.getFirstValue(text);
            const secondValue = this.getSecondValue(text);
            if (!opts[firstValue]) opts[firstValue] = [secondValue];
            else opts[firstValue].push(secondValue);
            // Store a hash of the original key value pairs for later
            conts[text] = options[opt][0];
            vals[text] = value;
        }

        const currentFirst = this.getFirstValue(this.text_);
        const currentSecond = this.getSecondValue(this.text_);

        if (!this.isFirst_) {
            options = opts[currentFirst];
        } else {
            options = Object.keys(opts);
            // Flip the first and second options to make it sorted the way we want it (medium, large, dual)
            if (options.length == 3) {
                const temp = options[1];
                options[1] = options[0];
                options[0] = temp;
            }
        }

        const isFirstUrl = {
            'large motors': FieldMotors.DUAL_MOTORS_DATAURI,
            'large motor': FieldMotors.MOTORS_LARGE_DATAURI,
            'medium motor': FieldMotors.MOTORS_MEDIUM_DATAURI
        }
        const columns = options.length;

        for (let i = 0, option: any; option = options[i]; i++) {
            let text = this.isFirst_ ? option + ' ' + opts[option][0] : currentFirst + ' ' + option;
            text = text.replace(/\xA0/g, ' ');
            const content: any = conts[text];
            const value = vals[text];
            // Icons with the type property placeholder take up space but don't have any functionality
            // Use for special-case layouts
            if (content.type == 'placeholder') {
                let placeholder = document.createElement('span');
                placeholder.setAttribute('class', 'blocklyDropDownPlaceholder');
                placeholder.style.width = content.width + 'px';
                placeholder.style.height = content.height + 'px';
                contentDiv.appendChild(placeholder);
                continue;
            }
            let button = document.createElement('button');
            button.setAttribute('id', ':' + i); // For aria-activedescendant
            button.setAttribute('role', 'menuitem');
            button.setAttribute('class', 'blocklyDropDownButton');
            button.title = this.isFirst_ ? this.getFirstValue(content.alt) : content.alt;
            button.style.width = ((this.itemWidth_) - 8) + 'px';
            button.style.height = ((this.itemWidth_) - 8) + 'px';
            let backgroundColor = this.backgroundColour_;
            if (value == this.getValue()) {
                // This icon is selected, show it in a different colour
                backgroundColor = this.sourceBlock_.getColourTertiary();
                button.setAttribute('aria-selected', 'true');
            }
            button.style.backgroundColor = backgroundColor;
            button.style.borderColor = this.borderColour_;
            Blockly.bindEvent_(button, 'click', this, this.buttonClick_);
            Blockly.bindEvent_(button, 'mouseup', this, this.buttonClick_);
            // These are applied manually instead of using the :hover pseudoclass
            // because Android has a bad long press "helper" menu and green highlight
            // that we must prevent with ontouchstart preventDefault
            Blockly.bindEvent_(button, 'mousedown', button, function (e) {
                this.setAttribute('class', 'blocklyDropDownButton blocklyDropDownButtonHover');
                e.preventDefault();
            });
            Blockly.bindEvent_(button, 'mouseover', button, function () {
                this.setAttribute('class', 'blocklyDropDownButton blocklyDropDownButtonHover');
                contentDiv.setAttribute('aria-activedescendant', this.id);
            });
            Blockly.bindEvent_(button, 'mouseout', button, function () {
                this.setAttribute('class', 'blocklyDropDownButton');
                contentDiv.removeAttribute('aria-activedescendant');
            });
            let buttonImg = document.createElement('img');
            buttonImg.src = this.isFirst_ ? isFirstUrl[option.replace(/\xA0/g, ' ')] : content.src;
            //buttonImg.alt = icon.alt;
            // Upon click/touch, we will be able to get the clicked element as e.target
            // Store a data attribute on all possible click targets so we can match it to the icon.
            button.setAttribute('data-value', value);
            buttonImg.setAttribute('data-value', value);
            button.appendChild(buttonImg);
            contentDiv.appendChild(button);
        }
        contentDiv.style.width = (this.itemWidth_ * columns) + 'px';
        dropdownDiv.appendChild(contentDiv);

        Blockly.DropDownDiv.setColour(this.backgroundColour_, this.borderColour_);

        // Calculate positioning based on the field position.
        let scale = this.sourceBlock_.workspace.scale;
        let width = this.isFirst_ ? (this as any).width1 : (this as any).width2;
        let bBox = { width: this.size_.width, height: this.size_.height };
        width *= scale;
        bBox.height *= scale;
        let position = this.fieldGroup_.getBoundingClientRect();
        let leftPosition = this.isFirst_ ? position.left : position.left + (scale * (this as any).width1) + Blockly.BlockSvg.BOX_FIELD_PADDING;
        let primaryX = leftPosition + width / 2;
        let primaryY = position.top + bBox.height;
        let secondaryX = primaryX;
        let secondaryY = position.top;
        // Set bounds to workspace; show the drop-down.
        (Blockly.DropDownDiv as any).setBoundsElement(this.sourceBlock_.workspace.getParentSvg().parentNode);
        (Blockly.DropDownDiv as any).show(this, primaryX, primaryY, secondaryX, secondaryY,
            this.onHide_.bind(this));

        // Update colour to look selected.
        if (this.isFirst_ && this.box_) {
            this.box_.setAttribute('fill', this.sourceBlock_.getColourTertiary());
        } else if (!this.isFirst_ && this.box2_) {
            this.box2_.setAttribute('fill', this.sourceBlock_.getColourTertiary());
        }
    }

    protected buttonClick_ = function (e: any) {
        let value = e.target.getAttribute('data-value');
        this.setValue(value);
        Blockly.DropDownDiv.hide();
    };


    /**
     * Callback for when the drop-down is hidden.
     */
    protected onHide_ = function () {
        Blockly.DropDownDiv.content_.removeAttribute('role');
        Blockly.DropDownDiv.content_.removeAttribute('aria-haspopup');
        Blockly.DropDownDiv.content_.removeAttribute('aria-activedescendant');
        Blockly.DropDownDiv.getContentDiv().style.width = '';
        if (this.isFirst_ && this.box_) {
            this.box_.setAttribute('fill', this.sourceBlock_.getColour());
        } else if (!this.isFirst_ && this.box2_) {
            this.box2_.setAttribute('fill', this.sourceBlock_.getColour());
        }
    };

    static MOTORS_MEDIUM_DATAURI = 'data:image/png;base64,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';


    static MOTORS_LARGE_DATAURI = 'data:image/png;base64,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';

    static DUAL_MOTORS_DATAURI = 'data:image/png;base64,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';
}