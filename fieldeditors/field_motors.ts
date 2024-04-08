/// <reference path="../node_modules/pxt-core/localtypings/pxtblockly.d.ts"/>

import { BlockSvg } from "blockly";

const pxtblockly = pxt.blocks.requirePxtBlockly()
const Blockly = pxt.blocks.requireBlockly();

export interface FieldMotorsOptions {
    blocksInfo: any;
    columns?: string;
    width?: string;
    //sort?: boolean;
}

export class FieldMotors extends pxtblockly.FieldImages {
    public isFieldCustom_ = true;
    //public shouldSort_: boolean;

    constructor(text: string, options: FieldMotorsOptions, validator?: Function) {
        super(text, options, validator);

        this.columns_ = parseInt(options.columns) || 4;
        this.width_ = parseInt(options.width) || 400;
        //this.shouldSort_ = options.sort;
        this.addLabel_ = true;
    }

    protected render_(): void {
        if (this.addLabel_) {
            this.renderSelectedText_()
            this.positionBorderRect_();
        }
        else {
            super.render_();
        }
    }

    /** Renders the selected option, which must be text. */
    protected renderSelectedText_() {
        // Retrieves the selected option to display through getText_.
        this.getTextContent().nodeValue = this.getDisplayText_();
        const textElement = this.getTextElement();
        Blockly.utils.dom.addClass(textElement, 'blocklyDropdownText');
        textElement.setAttribute('text-anchor', 'start');

        // Height and width include the border rect.
        const hasBorder = !!this.borderRect_;
        const height = Math.max(
            hasBorder ? this.getConstants()!.FIELD_DROPDOWN_BORDER_RECT_HEIGHT : 0,
            this.getConstants()!.FIELD_TEXT_HEIGHT,
        );
        const textWidth = Blockly.utils.dom.getFastTextWidth(
            this.getTextElement(),
            this.getConstants()!.FIELD_TEXT_FONTSIZE,
            this.getConstants()!.FIELD_TEXT_FONTWEIGHT,
            this.getConstants()!.FIELD_TEXT_FONTFAMILY,
        );
        const xPadding = hasBorder
            ? this.getConstants()!.FIELD_BORDER_RECT_X_PADDING
            : 0;
        let arrowWidth = 0;
        if (this.getSvgArrow()) {
            arrowWidth = this.positionSVGArrow_(
                textWidth + xPadding,
                height / 2 - this.getConstants()!.FIELD_DROPDOWN_SVG_ARROW_SIZE / 2,
            );
        }
        this.size_.width = textWidth + arrowWidth + xPadding * 2;
        this.size_.height = height;

        this.positionTextElement_(xPadding, textWidth);
    }

    positionSVGArrow_(x: number, y: number): number {
        const svgArrow = this.getSvgArrow();
        if (!svgArrow) {
            return 0;
        }
        const block = this.getSourceBlock();
        const hasBorder = !!this.borderRect_;
        const xPadding = hasBorder
            ? this.getConstants()!.FIELD_BORDER_RECT_X_PADDING
            : 0;
        const textPadding = this.getConstants()!.FIELD_DROPDOWN_SVG_ARROW_PADDING;
        const svgArrowSize = this.getConstants()!.FIELD_DROPDOWN_SVG_ARROW_SIZE;
        const arrowX = block.RTL ? xPadding : x + textPadding;
        svgArrow.setAttribute(
            'transform',
            'translate(' + arrowX + ',' + y + ')',
        );
        return svgArrowSize + textPadding;
    }

    // This hack exists because svgArrow is private in Blockly's field dropdown.
    // It should always be the last image element in the field group
    protected getSvgArrow() {
        if (this.fieldGroup_) {
            const children = this.fieldGroup_.children;

            let lastImage: SVGImageElement;

            for (let i = 0; i < children.length; i++) {
                if (children.item(i).tagName.toLowerCase() === "image") {
                    lastImage = children.item(i) as SVGImageElement;
                }
            }

            return lastImage;
        }

        return undefined;
    }

    /**
     * Create a dropdown menu under the text.
     * @private
     */
    public showEditor_() {
        // If there is an existing drop-down we own, this is a request to hide the drop-down.
        if (Blockly.DropDownDiv.hideIfOwner(this)) {
            return;
        }
        let sourceBlock = this.sourceBlock_ as BlockSvg;
        // If there is an existing drop-down someone else owns, hide it immediately and clear it.
        Blockly.DropDownDiv.hideWithoutAnimation();
        Blockly.DropDownDiv.clearContent();
        // Populate the drop-down with the icons for this field.
        let dropdownDiv = Blockly.DropDownDiv.getContentDiv();
        let contentDiv = document.createElement('div');
        // Accessibility properties
        contentDiv.setAttribute('role', 'menu');
        contentDiv.setAttribute('aria-haspopup', 'true');
        const options = this.getOptions();
        //if (this.shouldSort_) options.sort();
        for (let i = 0; i < options.length; i++) {
            const content = (options[i] as any)[0]; // Human-readable text or image.
            const value = (options[i] as any)[1]; // Language-neutral value.
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
            button.title = content.alt;
            if ((this as any).columns_) {
                button.style.width = (((this as any).width_ / (this as any).columns_) - 8) + 'px';
                //button.style.height = ((this.width_ / this.columns_) - 8) + 'px';
            } else {
                button.style.width = content.width + 'px';
                button.style.height = content.height + 'px';
            }
            let backgroundColor = sourceBlock.getColour();
            if (value == this.getValue()) {
                // This icon is selected, show it in a different colour
                backgroundColor = sourceBlock.getColourTertiary();
                button.setAttribute('aria-selected', 'true');
            }
            button.style.backgroundColor = backgroundColor;
            button.style.borderColor = sourceBlock.getColourTertiary();
            button.addEventListener("click", (event) => this.buttonClick_(event));
            button.addEventListener("mouseover", () => {
                button.setAttribute('class', 'blocklyDropDownButton blocklyDropDownButtonHover');
                contentDiv.setAttribute('aria-activedescendant', button.id);
            });
            button.addEventListener("mouseout", () => {
                button.setAttribute('class', 'blocklyDropDownButton');
                contentDiv.removeAttribute('aria-activedescendant');
            });
            let buttonImg = document.createElement('img');
            buttonImg.src = content.src;
            //buttonImg.alt = icon.alt;
            // Upon click/touch, we will be able to get the clicked element as e.target
            // Store a data attribute on all possible click targets so we can match it to the icon.
            button.setAttribute('data-value', value);
            buttonImg.setAttribute('data-value', value);
            buttonImg.style.height = 'auto';
            button.appendChild(buttonImg);
            if (this.addLabel_) {
                const buttonText = this.createTextNode_(content.alt);
                buttonText.setAttribute('data-value', value);
                buttonText.style.whiteSpace = 'inherit';
                buttonText.style.width = 'auto';
                buttonText.style.padding = '0 10px';
                button.appendChild(buttonText);
            }
            contentDiv.appendChild(button);
        }
        contentDiv.style.width = (this as any).width_ + 'px';
        contentDiv.style.display = 'flex';
        contentDiv.style.alignItems = 'stretch';
        dropdownDiv.appendChild(contentDiv);

        Blockly.DropDownDiv.setColour(sourceBlock.getColour(), sourceBlock.getColourTertiary());

        // Position based on the field position.
        Blockly.DropDownDiv.showPositionedByField(this, this.onHideCallback.bind(this));

        // Update colour to look selected.
        this.savedPrimary_ = sourceBlock?.getColour();
        if (sourceBlock?.isShadow()) {
            sourceBlock.setColour(sourceBlock.style.colourTertiary);
        } else if (this.borderRect_) {
            this.borderRect_.setAttribute('fill', sourceBlock.style.colourTertiary);
        }
    }

}