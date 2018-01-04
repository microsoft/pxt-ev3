/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

export interface FieldPortsOptions extends Blockly.FieldCustomDropdownOptions {
    columns?: string;
    width?: string;
}

export class FieldPorts extends Blockly.FieldDropdown implements Blockly.FieldCustom {
    public isFieldCustom_ = true;

    // Width in pixels
    private width_: number;

    // Columns in grid
    private columns_: number;

    private savedPrimary_: string;

    constructor(text: string, options: FieldPortsOptions, validator?: Function) {
        super(options.data);

        this.columns_ = parseInt(options.columns) || 4;
        this.width_ = parseInt(options.width) || 300;
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
        for (let i = 0, option: any; option = options[i]; i++) {
            let content = (options[i] as any)[0]; // Human-readable text or image.
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
            if (this.columns_) {
                button.style.width = ((this.width_ / this.columns_) - 8) + 'px';
                button.style.height = ((this.width_ / this.columns_) - 8) + 'px';
            } else {
                button.style.width = content.width + 'px';
                button.style.height = content.height + 'px';
            }
            let backgroundColor = this.sourceBlock_.getColour();
            if (value == this.getValue()) {
                // This icon is selected, show it in a different colour
                backgroundColor = this.sourceBlock_.getColourTertiary();
                button.setAttribute('aria-selected', 'true');
            }
            button.style.backgroundColor = backgroundColor;
            button.style.borderColor = this.sourceBlock_.getColourTertiary();
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
            buttonImg.src = content.src;
            //buttonImg.alt = icon.alt;
            // Upon click/touch, we will be able to get the clicked element as e.target
            // Store a data attribute on all possible click targets so we can match it to the icon.
            button.setAttribute('data-value', value);
            buttonImg.setAttribute('data-value', value);
            button.appendChild(buttonImg);
            contentDiv.appendChild(button);
        }
        contentDiv.style.width = this.width_ + 'px';
        dropdownDiv.appendChild(contentDiv);

        Blockly.DropDownDiv.setColour(this.sourceBlock_.getColour(), this.sourceBlock_.getColourTertiary());

        // Calculate positioning based on the field position.
        var scale = this.sourceBlock_.workspace.scale;
        var bBox = { width: this.size_.width, height: this.size_.height };
        bBox.width *= scale;
        bBox.height *= scale;
        var position = this.fieldGroup_.getBoundingClientRect();
        var primaryX = position.left + bBox.width / 2;
        var primaryY = position.top + bBox.height;
        var secondaryX = primaryX;
        var secondaryY = position.top;
        // Set bounds to workspace; show the drop-down.
        (Blockly.DropDownDiv as any).setBoundsElement(this.sourceBlock_.workspace.getParentSvg().parentNode);
        (Blockly.DropDownDiv as any).show(this, primaryX, primaryY, secondaryX, secondaryY,
            this.onHide_.bind(this));
    }

    /**
     * Callback for when a button is clicked inside the drop-down.
     * Should be bound to the FieldIconMenu.
     * @param {Event} e DOM event for the click/touch
     * @private
     */
    private buttonClick_ = function (e: any) {
        let value = e.target.getAttribute('data-value');
        this.setValue(value);
        Blockly.DropDownDiv.hide();
    };

    /**
     * Callback for when the drop-down is hidden.
     */
    private onHide_ = function () {
        Blockly.DropDownDiv.content_.removeAttribute('role');
        Blockly.DropDownDiv.content_.removeAttribute('aria-haspopup');
        Blockly.DropDownDiv.content_.removeAttribute('aria-activedescendant');
    };
}