namespace pxsim.visuals {
    export abstract class View {
        protected element: SVGGElement;
        protected rendered = false;
        protected visible = false;
        protected selected: boolean;
        protected width: number = 0;
        protected height: number = 0;
        protected left: number = 0;
        protected top: number = 0;
        protected scaleFactor: number = 1;

        private changed: boolean;
        private hover: boolean = false;

        protected theme: IBoardTheme;

        protected abstract buildDom(): SVGElement;
        public abstract getInnerWidth(): number;
        public abstract getInnerHeight(): number;

        public inject(parent: SVGElement, width?: number, visible = true) {
            this.width = width;
            parent.appendChild(this.getView());

            if (visible) {
                this.visible = true;
                this.onComponentInjected();
            }
        }

        public getWidth() {
            return this.scaleFactor == undefined ? this.getInnerWidth() : this.getInnerWidth() * this.scaleFactor;
        }

        public getHeight() {
            return this.scaleFactor == undefined ? this.getInnerHeight() : this.getInnerHeight() * this.scaleFactor;
        }

        public onComponentInjected() {
            // To be overridden by sub class
        }

        public onComponentVisible() {
            // To be overridden by sub class
        }

        public onComponentHidden() {
            // To be overridden by sub class
        }

        public translate(x: number, y: number, applyImmediately = true) {
            this.left = x;
            this.top = y;

            if (applyImmediately) {
                this.updateTransform();
            }
        }

        public scale(scaleFactor: number, applyImmediately = true) {
            this.scaleFactor = scaleFactor;

            if (applyImmediately) {
                this.updateTransform();
            }
        }

        public updateState() {
        }

        public updateTheme(theme: IBoardTheme) {
            this.theme = theme;
            this.updateThemeCore();
        }

        public updateThemeCore() {
        }

        public setVisible(visible: boolean) {
            if (this.rendered) {
                this.getView().style.display = visible ? 'block' : 'none';
            }
        }

        public hasClick() {
            return true;
        }

        private onClickHandler: (ev: any) => void;
        public registerClick(handler: (ev: any) => void, zoom?: boolean) {
            this.onClickHandler = handler;
            if (zoom) {
                this.getView().addEventListener(pointerEvents.up, (ev: any) => {
                    if (!this.getSelected()) {
                        this.onClickHandler(ev);
                        this.setHover(false);
                    }
                });
                this.getView().addEventListener(pointerEvents.move, () => {
                    if (!this.getSelected()) {
                        this.setHover(true);
                    }
                });
                this.getView().addEventListener(pointerEvents.leave, () => {
                    this.setHover(false);
                });
            } else {
                this.getView().addEventListener(pointerEvents.up, this.onClickHandler);
            }
        }

        public dispose() {
            if (this.onClickHandler) this.getView().removeEventListener(pointerEvents.up, this.onClickHandler)
            View.dispose(this);
        }

        protected getView() {
            if (!this.rendered) {
                this.element = svg.elt("g") as SVGGElement;
                View.track(this);

                const content = this.buildDom();
                if (content) {
                    this.element.appendChild(content);
                }
                this.updateTransform();
                this.rendered = true;
            }
            return this.element;
        }

        public resize(width: number, height: number) {
            this.width = width;
            this.height = height;
        }

        private updateTransform() {
            if (this.rendered) {
                let left = this.left;
                let top = this.top;
                let scaleFactor = this.scaleFactor;
                if (this.hover) {
                    const hoverScaleFactor = scaleFactor + 0.05;
                    // Scale around center of module 
                    const centerX = this.getWidth() / 2;
                    const centerY = this.getHeight() / 2;
                    left = left - centerX * (hoverScaleFactor - 1);
                    top = top - centerY * (hoverScaleFactor - 1);
                    scaleFactor = hoverScaleFactor;
                }

                let transform = `translate(${left} ${top})`;

                if (scaleFactor !== 1) {
                    transform += ` scale(${scaleFactor})`;
                }

                this.element.setAttribute("transform", transform);
            }
        }

        private static currentId = 0;
        private static allViews: Map<View> = {};

        protected static getInstance(element: Element) {
            if (element.hasAttribute("ref-id")) {
                return View.allViews[element.getAttribute("ref-id")];
            }

            return undefined;
        }

        private static track(view: View) {
            const myId = "id-" + (View.currentId++);
            view.element.setAttribute("ref-id", myId);
            View.allViews[myId] = view;
        }

        private static dispose(view: View) {
            if (view.element) {
                const id = view.element.getAttribute("ref-id");
                // TODO: Remove from DOM
                view.element.parentNode.removeChild(view.element);
                delete View.allViews[id];
            }
        }

        ///////// HOVERED STATE /////////////

        public getHover() {
            return this.hover;
        }

        public setHover(hover: boolean) {
            if (this.hover != hover) {
                this.hover = hover;
                this.updateTransform();
            }
        }

        ///////// SELECTED STATE /////////////

        public getSelected() {
            return this.selected;
        }

        public setSelected(selected: boolean) {
            this.selected = selected;
            this.setChangedState();
        }

        protected setChangedState() {
            this.changed = true;
        }

        public didChange() {
            const res = this.changed;
            this.changed = false;
            return res;
        }

    }

    export abstract class SimView<T extends BaseNode> extends View implements LayoutElement {
        constructor(protected state: T) {
            super();
        }

        public getId() {
            return this.state.id;
        }

        public getPort() {
            return this.state.port;
        }

        public getPaddingRatio() {
            return 0;
        }

        public getWiringRatio() {
            return 0.5;
        }

        public setSelected(selected: boolean) { }

        protected getView() {
            return super.getView();
        }
    }

    export class ViewContainer extends View {
        public getInnerWidth() {
            return 0;
        }

        public getInnerHeight() {
            return 0;
        }

        public addView(view: View) {
            view.inject(this.element);
        }

        public clear() {
            forEachElement(this.element.childNodes, e => {
                this.element.removeChild(e);
            });
        }

        public onComponentInjected() {
            const observer = new MutationObserver(records => {
                records.forEach(r => {
                    forEachElement(r.addedNodes, node => {
                        const instance = View.getInstance(node);
                        if (instance) {
                            instance.onComponentVisible();
                        }
                    });
                    forEachElement(r.removedNodes, node => {
                        const instance = View.getInstance(node);
                        if (instance) {
                            instance.onComponentHidden();
                        }
                    });
                })
            });

            observer.observe(this.element, {
                childList: true,
                subtree: true
            });
        }

        protected buildDom(): SVGElement {
            return undefined;
        }
    }

    function forEachElement(nodes: NodeList, cb: (e: Element) => void) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                cb(node as Element);
            }
        }
    }
}