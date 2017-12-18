namespace pxsim.visuals {
    export interface LinearGradientDefinition {
        stops: LinearGradientStop[];
    }

    export interface LinearGradientStop {
        offset: string | number;
        color: string;
    }

    export type TouchCallback = (event: MouseEvent | TouchEvent | PointerEvent) => void;

    export function touchEvents(e: SVGElement | SVGElement[], move?: TouchCallback, down?: TouchCallback, up?: TouchCallback, leave?: TouchCallback) {
        if (Array.isArray(e)) {
            e.forEach(el => bindEvents(el, move, down, up, leave));
        }
        else {
            bindEvents(e, move, down, up, leave);
        }
    }

    function bindEvents(e: SVGElement, move?: TouchCallback, down?: TouchCallback, up?: TouchCallback, leave?: TouchCallback) {
        if ((window as any).PointerEvent) {
            if (down) e.addEventListener("pointerdown", down);
            if (up) e.addEventListener("pointerup", up);
            if (leave) e.addEventListener("pointerleave", leave);
            if (move) e.addEventListener("pointermove", move);
        }
        else {
            if (down) e.addEventListener("mousedown", down);
            if (up) e.addEventListener("mouseup", up);
            if (leave) e.addEventListener("mouseleave", leave);
            if (move) e.addEventListener("mousemove", move);

            if (pxsim.svg.isTouchEnabled()) {
                if (down) e.addEventListener("touchstart", down);
                if (up) e.addEventListener("touchend", up);
                if (leave) e.addEventListener("touchcancel", leave);
                if (move) e.addEventListener("touchmove", move);
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