/// <reference path="../node_modules/pxt-core/localtypings/blockly.d.ts"/>
/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>

export interface FieldPortsOptions extends Blockly.FieldCustomDropdownOptions {
    columns?: string;
    width?: string;
}

export class FieldBrickButtons extends Blockly.FieldDropdown implements Blockly.FieldCustom {
    public isFieldCustom_ = true;

    // Width in pixels
    private width_: number;

    // Columns in grid
    private columns_: number;

    private savedPrimary_: string;

    constructor(text: string, options: FieldPortsOptions, validator?: Function) {
        super(options.data);

        this.columns_ = parseInt(options.columns) || 4;
        this.width_ = parseInt(options.width) || 150;
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

        const buttonsSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg") as SVGGElement;
        pxsim.svg.hydrate(buttonsSVG, {
            viewBox: "0 0 256.68237 256.68237",
            width: this.width_,
            height: this.width_
        });
        contentDiv.appendChild(buttonsSVG);

        const gWrapper = pxsim.svg.child(buttonsSVG, 'g', { 'transform': 'translate(-4.695057,58.29823)' });
        const gInnerWrapper = pxsim.svg.child(gWrapper, 'g', { 'transform': 'translate(3.9780427e-6,-32.677281)' });

        const back = pxsim.svg.child(gInnerWrapper, 'path', {
            style: 'fill:#6a6a6a;stroke-width:3.91719985',
            d: 'M 106.30882,198.38022 C 84.431262,177.26258 50.453467,142.52878 50.453467,142.52878 v -7.12931 H 37.087971 a 32.381533,32.381533 0 1 1 0,-64.763062 H 50.457376 V 63.503186 L 105.71731,7.0563355 h 55.25604 c 25.02699,25.5048885 55.25994,55.2599395 55.25994,55.2599395 v 8.320133 h 12.77398 a 32.381533,32.381533 0 0 1 0,64.763062 h -12.77398 v 7.13323 c -29.43384,30.27603 -54.66454,55.85144 -54.66454,55.85144 z'
        })

        const buttonLeft = pxsim.svg.child(gInnerWrapper, 'path', {
            style: 'fill:#a8a9a8;stroke-width:3.91719985',
            d: 'm 36.492567,78.357208 h 40.69971 V 126.48393 H 36.492567 A 24.063359,24.063359 0 0 1 12.429199,102.42057 v 0 A 24.063359,24.063359 0 0 1 36.492567,78.357208 Z'
        })

        const buttonRight = pxsim.svg.child(gInnerWrapper, 'path', {
            style: 'fill:#a8a9a8;stroke-width:3.91719985',
            d: 'M 229.00727,126.48784 H 188.30756 V 78.361126 h 40.69971 a 24.063359,24.063359 0 0 1 24.06335,24.063354 v 0 a 24.063359,24.063359 0 0 1 -24.06335,24.06336 z'
        })

        const buttonEnter = pxsim.svg.child(gInnerWrapper, 'path', {
            style: 'fill:#3c3c3c;stroke-width:3.91719985',
            d: 'm 109.27806,78.357208 h 46.9398 a 1.782326,1.782326 0 0 1 1.78233,1.782326 V 124.7016 a 1.782326,1.782326 0 0 1 -1.78233,1.78233 h -46.9398 a 1.782326,1.782326 0 0 1 -1.78233,-1.78233 V 80.139534 a 1.782326,1.782326 0 0 1 1.78233,-1.782326 z'
        })

        const buttonTop = pxsim.svg.child(gInnerWrapper, 'path', {
            style: 'fill:#a8a9a8;stroke-width:3.91719985',
            d: 'm 108.09114,15.967966 49.90905,-0.59542 37.43276,38.619675 -15.44943,15.449437 V 97.367379 H 165.7249 V 81.306861 A 11.978797,11.978797 0 0 0 153.84012,69.422075 c -11.59883,-0.184102 -43.37516,0 -43.37516,0 A 9.6676495,9.6676495 0 0 0 100.36251,79.520618 V 97.347793 H 86.103905 V 69.422075 L 70.654464,53.97264 Z'
        })

        const buttonBottom = pxsim.svg.child(gInnerWrapper, 'path', {
            style: 'fill:#a8a9a8;stroke-width:3.91719985',
            d: 'M 157.78865,189.01028 108.18908,189.38233 70.654464,150.794 86.323259,135.4895 v -28.08625 h 14.101921 v 16.11144 a 12.006218,12.006218 0 0 0 11.85346,11.9788 c 11.59882,0.1841 43.13227,0 43.13227,0 a 10.18472,10.18472 0 0 0 10.38059,-10.38058 v -17.70966 h 14.39179 v 28.08632 l 15.3045,15.3045 z'
        })

        const buttons = [buttonEnter, buttonLeft, buttonRight, buttonTop, buttonBottom];
        const options = this.getOptions();
        for (let i = 0, option: any; option = options[i]; i++) {
            let content = (options[i] as any)[0]; // Human-readable text or image.
            const value = (options[i] as any)[1]; // Language-neutral value.
            const button = buttons[i];
            button.setAttribute('id', ':' + i); // For aria-activedescendant
            button.setAttribute('role', 'menuitem');
            button.setAttribute('cursor', 'pointer');
            const title = pxsim.svg.child(button, 'title');
            title.textContent = content;

            Blockly.bindEvent_(button, 'click', this, this.buttonClick_);
            Blockly.bindEvent_(button, 'mouseup', this, this.buttonClick_);
            // These are applied manually instead of using the :hover pseudoclass
            // because Android has a bad long press "helper" menu and green highlight
            // that we must prevent with ontouchstart preventDefault
            Blockly.bindEvent_(button, 'mousedown', button, function (e) {
                this.setAttribute('stroke', '#ffffff');
                e.preventDefault();
            });
            Blockly.bindEvent_(button, 'mouseover', button, function () {
                this.setAttribute('stroke', '#ffffff');
            });
            Blockly.bindEvent_(button, 'mouseout', button, function () {
                this.setAttribute('stroke', 'transparent');
            });

            button.setAttribute('data-value', value);
        }

        contentDiv.style.width = this.width_ + 'px';
        dropdownDiv.appendChild(contentDiv);

        Blockly.DropDownDiv.setColour('#ffffff', '#dddddd');

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
        Blockly.DropDownDiv.getContentDiv().style.width = '';
    };
}