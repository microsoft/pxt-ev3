namespace pxsim.visuals {
    export interface LinearGradientDefinition {
        stops: LinearGradientStop[];
    }

    export interface LinearGradientStop {
        offset: string | number;
        color: string;
    }

    export type TouchCallback = (event: MouseEvent | TouchEvent | PointerEvent) => void;

    export function touchEvents(e: SVGElement | SVGElement[], move?: TouchCallback, down?: TouchCallback, up?: TouchCallback) {
        if (Array.isArray(e)) {
            e.forEach(el => bindEvents(el, move, down, up));
        }
        else {
            bindEvents(e, move, down, up);
        }
    }

    function bindEvents(e: SVGElement, move?: TouchCallback, down?: TouchCallback, up?: TouchCallback) {

        const moveEvent = move ? (ev: MouseEvent) => {
            move.call(this, ev);
            ev.preventDefault();
            ev.stopPropagation();
        } : undefined;

        const enterEvent = move ? (ev: MouseEvent) => {
            if (ev.buttons != 1) {
                // cancel all events when we re-enter without a button down
                upEvent(ev);
            }
        } : undefined;

        const upEvent = up ? (ev: MouseEvent) => {
            up.call(this, ev);
            ev.preventDefault();
            ev.stopPropagation();

            // Unregister document up and move events
            if ((window as any).PointerEvent) {
                if (moveEvent) document.removeEventListener("pointermove", moveEvent);
                if (upEvent) document.removeEventListener("pointerup", upEvent);
                if (upEvent) document.removeEventListener("pointercancel", upEvent);
                if (moveEvent) document.removeEventListener("pointerenter", enterEvent);
            } else {
                if (moveEvent) document.removeEventListener("mousemove", moveEvent);
                if (upEvent) document.removeEventListener("mouseup", upEvent);
                if (moveEvent) document.removeEventListener("mouseenter", enterEvent);
                if (pxsim.svg.isTouchEnabled()) {
                    if (moveEvent) document.removeEventListener("touchmove", moveEvent);
                    if (upEvent) document.removeEventListener("touchend", upEvent);
                    if (upEvent) document.removeEventListener("touchcancel", upEvent);
                }
            }
        } : undefined;

        const downEvent = down ? (ev: MouseEvent) => {
            down.call(this, ev);
            ev.preventDefault();
            ev.stopPropagation();

            // Register document up and move events
            if ((window as any).PointerEvent) {
                if (moveEvent) document.addEventListener("pointermove", moveEvent);
                if (upEvent) document.addEventListener("pointerup", upEvent);
                if (upEvent) document.addEventListener("pointercancel", upEvent);
                if (moveEvent) document.addEventListener("pointerenter", enterEvent);
            } else {
                if (moveEvent) document.addEventListener("mousemove", moveEvent);
                if (upEvent) document.addEventListener("mouseup", upEvent);
                if (moveEvent) document.addEventListener("mouseenter", enterEvent);

                if (pxsim.svg.isTouchEnabled()) {
                    if (moveEvent) document.addEventListener("touchmove", moveEvent);
                    if (upEvent) document.addEventListener("touchend", upEvent);
                    if (upEvent) document.addEventListener("touchcancel", upEvent);
                }
            }
        } : undefined;

        if ((window as any).PointerEvent) {
            if (downEvent) e.addEventListener("pointerdown", downEvent);
        }
        else {
            if (downEvent) e.addEventListener("mousedown", downEvent);

            if (pxsim.svg.isTouchEnabled()) {
                if (downEvent) e.addEventListener("touchstart", downEvent);
            }
        }
    }

    export function createGradient(id: string, opts: LinearGradientDefinition) {
        const g = svg.elt("linearGradient") as SVGLinearGradientElement;
        g.setAttribute("id", id);

        opts.stops.forEach(stop => {
            let offset: string;

            if (typeof stop.offset === "number") {
                offset = stop.offset + "%"
            }
            else {
                offset = stop.offset as string;
            }

            svg.child(g, "stop", { offset, "stop-color": stop.color });
        });

        return g;
    }

    export function updateGradient(gradient: SVGLinearGradientElement, opts: LinearGradientDefinition) {
        let j = 0;

        forEachElement(gradient.childNodes, (e, i) => {
            if (i < opts.stops.length) {
                const stop = opts.stops[i];
                e.setAttribute("offset", offsetString(stop.offset));
                e.setAttribute("stop-color", stop.color);
            }
            else {
                gradient.removeChild(e);
            }
            j = i + 1;
        });

        for (; j < opts.stops.length; j++) {
            const stop = opts.stops[j];
            svg.child(gradient, "stop", { offset: offsetString(stop.offset), "stop-color": stop.color });
        }
    }

    export function forEachElement(nodes: NodeList, cb: (e: Element, i: number) => void) {
        let index = 0;
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                cb(node as Element, index);
                ++index;
            }
        }
    }

    function offsetString(offset: string | number) {
        return (typeof offset === "number") ? offset + "%" : offset;
    }
}