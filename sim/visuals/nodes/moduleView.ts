namespace pxsim.visuals {

    export class ModuleView extends View implements LayoutElement {
        protected content: SVGSVGElement;

        protected controlShown: boolean;

        protected opacity: number;

        constructor(protected xml: string, protected prefix: string, protected id: NodeType, protected port: NodeType) {
            super();
            this.xml = this.normalizeXml(xml);
        }

        private normalizeXml(xml: string) {
            const prefix = this.prefix;
            xml = xml.replace(/id=\"(.*?)\"/g, (m: string, id: string) => {
                return `id="${this.normalizeId(id)}"`;
            });
            xml = xml.replace(/url\(#(.*?)\)/g, (m: string, id: string) => {
                return `url(#${this.normalizeId(id)}`;
            });
            xml = xml.replace(/xlink:href=\"#(.*?)\"/g, (m: string, id: string) => {
                return `xlink:href="#${this.normalizeId(id)}"`;
            });
            return xml;
        }

        protected normalizeId(svgId: string) {
            return `${this.prefix}-${svgId}`;
        }

        public getId() {
            return this.id;
        }

        public getPort() {
            return this.port;
        }

        public getPaddingRatio() {
            return 0;
        }

        public getWiringRatio() {
            return 0.5;
        }

        protected buildDom(): SVGElement {
            this.content = svg.parseString(this.xml);
            this.buildDomCore();
            this.attachEvents();
            if (this.hasClick())
                this.content.style.cursor = "pointer";
            return this.content;
        }

        protected buildDomCore() {

        }

        public getInnerHeight() {
            if (!this.content) {
                return 0;
            }
            if (!this.content.hasAttribute("viewBox")) {
                return parseFloat(this.content.getAttribute("height"));
            }
            return parseFloat(this.content.getAttribute("viewBox").split(" ")[3]);
        }

        public getInnerWidth() {
            if (!this.content) {
                return 0;
            }
            if (!this.content.hasAttribute("viewBox")) {
                return parseFloat(this.content.getAttribute("width"));
            }
            return parseFloat(this.content.getAttribute("viewBox").split(" ")[2]);
        }

        public attachEvents() {
        }

        public resize(width: number, height: number) {
            super.resize(width, height);
            this.updateDimensions(width, height);
        }

        private updateDimensions(width: number, height: number) {
            if (this.content) {
                const currentWidth = this.getInnerWidth();
                const currentHeight = this.getInnerHeight();
                const newHeight = currentHeight / currentWidth * width;
                const newWidth = currentWidth / currentHeight * height;
                this.content.setAttribute('width', `${width}`);
                this.content.setAttribute('height', `${newHeight}`);
            }
        }

        public hasClick() {
            return true;
        }

        public setSelected(selected: boolean) {
            super.setSelected(selected);
            this.updateOpacity();
        }

        public updateState() {
            this.updateOpacity();
        }

        protected updateOpacity() {
            if (this.rendered) {
                const opacity = this.selected ? 0.2 : 1;
                if (this.hasClick() && this.opacity != opacity) {
                    this.opacity = opacity;
                    this.setOpacity(this.opacity);
                    if (this.selected) this.content.style.cursor = "";
                    else this.content.style.cursor = "pointer";
                }
            }
        }

        protected setOpacity(opacity: number) {
            this.element.setAttribute("opacity", `${opacity}`);
        }
    }
}