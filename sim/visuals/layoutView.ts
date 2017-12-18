/// <reference path="./view.ts" />
/// <reference path="./nodes/staticView.ts" />
/// <reference path="./nodes/portView.ts" />

namespace pxsim.visuals {
    export const DEFAULT_WIDTH = 350;
    export const DEFAULT_HEIGHT = 700;

    export const BRICK_HEIGHT_RATIO = 1 / 3;
    export const MODULE_AND_WIRING_HEIGHT_RATIO = 1 / 3; // For inputs and outputs

    export const MODULE_HEIGHT_RATIO = MODULE_AND_WIRING_HEIGHT_RATIO * 3 / 4;
    export const WIRING_HEIGHT_RATIO = MODULE_AND_WIRING_HEIGHT_RATIO / 4;

    export const MODULE_INNER_PADDING_RATIO = 1 / 35;

    export interface LayoutElement extends View {
        getId(): number;
        getPort(): number;
        getPaddingRatio(): number;
        getWiringRatio(): number;
        setSelected(selected: boolean): void;
    }

    export class LayoutView extends ViewContainer {
        private inputs: LayoutElement[] = [];
        private outputs: LayoutElement[] = [];

        private inputWires: WireView[] = [];
        private outputWires: WireView[] = [];

        private selected: number;
        private selectedIsInput: boolean;
        private brick: BrickView;
        private offsets: number[];
        private contentGroup: SVGGElement;
        private scrollGroup: SVGGElement;
        private renderedViews: Map<boolean> = {};

        private childScaleFactor: number;

        private totalLength: number;
        private height: number;
        private hasDimensions = false;

        constructor() {
            super();

            this.outputs = [
                new PortView(0, 'A'),
                new PortView(1, 'B'),
                new PortView(2, 'C'),
                new PortView(3, 'D')
            ];

            this.brick = new BrickView(0);

            this.inputs = [
                new PortView(0, '1'),
                new PortView(1, '2'),
                new PortView(2, '3'),
                new PortView(3, '4')
            ];

            for (let port = 0; port < DAL.NUM_OUTPUTS; port++) {
                this.outputWires[port] = new WireView(port);
            }
            for (let port = 0; port < DAL.NUM_INPUTS; port++) {
                this.inputWires[port] = new WireView(port);
            }
        }

        public layout(width: number, height: number) {
            this.hasDimensions = true;
            this.width = width;
            this.height = height;
            this.scrollGroup.setAttribute("width", width.toString());
            this.scrollGroup.setAttribute("height", height.toString());
            this.position();
        }

        public setBrick(brick: BrickView) {
            this.brick = brick;
            this.position();
        }

        public getBrick() {
            return this.brick;
        }

        public setInput(port: number, child: LayoutElement) {
            if (this.inputs[port]) {
                // Remove current input
                this.inputs[port].dispose();
            }
            this.inputs[port] = child;
            this.position();
        }

        public setOutput(port: number, child: LayoutElement) {
            if (this.outputs[port]) {
                // Remove current input
                this.outputs[port].dispose();
            }
            this.outputs[port] = child;
            this.position();
        }

        public onClick(index: number, input: boolean, ev: any) {
            this.setSelected(index, input);
        }

        public clearSelected() {
            this.selected = undefined;
            this.selectedIsInput = undefined;
        }

        public setSelected(index: number, input?: boolean) {
            if (index !== this.selected || input !== this.selectedIsInput) {
                this.selected = index;
                this.selectedIsInput = input;
                const node = this.getSelected();
                if (node) node.setSelected(true);

                //this.redoPositioning();
                runtime.queueDisplayUpdate();
            }
        }

        public getSelected() {
            if (this.selected !== undefined) {
                return this.selectedIsInput ? this.inputs[this.selected] : this.outputs[this.selected];
            }
            return undefined;
        }

        protected buildDom(width: number) {
            this.contentGroup = svg.elt("g") as SVGGElement;
            this.scrollGroup = svg.child(this.contentGroup, "g") as SVGGElement;
            return this.contentGroup;
        }

        public getInnerWidth() {
            if (!this.hasDimensions) {
                return 0;
            }
            return this.width;
        }

        public getInnerHeight() {
            if (!this.hasDimensions) {
                return 0;
            }
            return this.height;
        }

        public updateTheme(theme: IBoardTheme) {
            this.inputs.forEach(n => {
                n.updateTheme(theme);
            })
            this.brick.updateTheme(theme);
            this.outputs.forEach(n => {
                n.updateTheme(theme);
            })
        }

        private position() {
            if (!this.hasDimensions) {
                return;
            }

            this.offsets = [];

            const selectedNode = this.getSelected();

            const contentWidth = this.width || DEFAULT_WIDTH;
            const contentHeight = this.height || DEFAULT_HEIGHT;

            const moduleHeight = this.getModuleHeight();

            const brickHeight = this.getBrickHeight();
            this.brick.inject(this.scrollGroup);
            const brickWidth = this.brick.getInnerWidth() / this.brick.getInnerHeight() * brickHeight;
            const brickPadding = (contentWidth - brickWidth) / 2;

            const modulePadding = contentWidth / 35;
            const moduleSpacing = contentWidth / 4;
            const moduleWidth = moduleSpacing - (modulePadding * 2);
            let currentX = modulePadding;
            let currentY = 0;
            this.outputs.forEach((n, i) => {
                const outputPadding = moduleWidth * n.getPaddingRatio();
                const outputWidth = moduleWidth - outputPadding * 2;
                n.inject(this.scrollGroup, outputWidth);
                n.resize(outputWidth);
                const nHeight = n.getHeight() / n.getWidth() * outputWidth;
                n.translate(currentX + outputPadding, currentY + moduleHeight - nHeight);
                n.setSelected(n == selectedNode);
                if (n.hasClick()) n.registerClick((ev: any) => {
                    this.onClick(i, false, ev);
                })
                currentX += moduleSpacing;
            })

            currentX = 0;
            currentY = moduleHeight;

            const wireBrickSpacing = brickWidth / 5;
            const wiringYPadding = 10;
            let wireStartX = 0;
            let wireEndX = brickPadding + wireBrickSpacing;
            let wireEndY = currentY + this.getWiringHeight() + wiringYPadding;
            let wireStartY = currentY - wiringYPadding;

            // Draw output lines
            for (let port = 0; port < DAL.NUM_OUTPUTS; port++) {
                if (!this.outputWires[port].isRendered()) this.outputWires[port].inject(this.scrollGroup);
                this.outputWires[port].updateDimensions(wireStartX + moduleSpacing * this.outputs[port].getWiringRatio(), wireStartY, wireEndX, wireEndY);
                this.outputWires[port].setSelected(this.outputs[port].getId() == NodeType.Port);
                wireStartX += moduleSpacing;
                wireEndX += wireBrickSpacing;
            }

            currentX = brickPadding;
            currentY += this.getWiringHeight();

            // Render the brick in the middle
            this.brick.resize(brickWidth);
            this.brick.translate(currentX, currentY);

            currentX = modulePadding;
            currentY += brickHeight + this.getWiringHeight();

            this.inputs.forEach((n, i) => {
                const inputPadding = moduleWidth * n.getPaddingRatio();
                const inputWidth = moduleWidth - inputPadding * 2;
                n.inject(this.scrollGroup, inputWidth);
                n.resize(inputWidth);
                n.translate(currentX + inputPadding, currentY);
                n.setSelected(n == selectedNode);
                if (n.hasClick()) n.registerClick((ev: any) => {
                    this.onClick(i, true, ev);
                })
                currentX += moduleSpacing;
            })

            wireStartX = moduleSpacing / 2;
            wireEndX = brickPadding + wireBrickSpacing;
            wireEndY = currentY - this.getWiringHeight() - wiringYPadding;
            wireStartY = currentY + wiringYPadding;

            // Draw input lines
            for (let port = 0; port < DAL.NUM_INPUTS; port++) {
                if (!this.inputWires[port].isRendered()) this.inputWires[port].inject(this.scrollGroup);
                this.inputWires[port].updateDimensions(wireStartX, wireStartY, wireEndX, wireEndY);
                this.inputWires[port].setSelected(this.inputs[port].getId() == NodeType.Port);
                wireStartX += moduleSpacing;
                wireEndX += wireBrickSpacing;
            }
        }

        public getSelectedCoords() {
            const selected = this.getSelected();
            if (!selected) return undefined;
            const port = this.getSelected().getPort();
            return {
                x: this.getSelected().getPort() * this.width / 4 + this.width * MODULE_INNER_PADDING_RATIO,
                y: this.selectedIsInput ? this.getModuleHeight() + 2 * this.getWiringHeight() + this.getBrickHeight() : this.getModuleHeight() / 4
            }
        }

        public getCloseIconCoords(closeIconWidth: number, closeIconHeight: number) {
            return {
                x: this.getSelected().getPort() * this.width / 4 + this.getModuleBounds().width / 2 - closeIconWidth / 2,
                y: this.selectedIsInput ? this.getModuleHeight() + 2 * this.getWiringHeight() + this.getBrickHeight() + this.getModuleHeight() - closeIconHeight : 0
            }
        }

        public getModuleHeight() {
            return (this.height || DEFAULT_HEIGHT) * MODULE_HEIGHT_RATIO;
        }

        public getBrickHeight() {
            return (this.height || DEFAULT_HEIGHT) * BRICK_HEIGHT_RATIO;
        }

        public getWiringHeight() {
            return (this.height || DEFAULT_HEIGHT) * WIRING_HEIGHT_RATIO;
        }

        public getModuleBounds() {
            return {
                width: this.width / 4,
                height: this.getModuleHeight()
            }
        }
    }
}