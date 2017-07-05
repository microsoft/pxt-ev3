namespace screen {
    //% shim=screen::_drawLine
    function _drawLine(p0: uint32, p1: uint32, mode: Draw): void { }

    //% shim=screen::_drawRect
    function _drawRect(p0: uint32, p1: uint32, mode: Draw): void { }

    //% shim=screen::_drawEllipse
    function _drawEllipse(p0: uint32, p1: uint32, mode: Draw): void { }

    function pack(x: number, y: number) {
        return Math.clamp(0, 512, x) | (Math.clamp(0, 512, y) << 16)
    }

    export function drawLine(x0: number, y0: number, x1: number, y1: number, mode?: Draw) {
        _drawLine(pack(x0, y0), pack(x1, y1), mode)
    }

    export function drawRect(x: number, y: number, w: number, h: number, mode?: Draw) {
        _drawRect(pack(x, y), pack(w, h), mode)
    }

    export function drawEllipse(x: number, y: number, rx: number, ry: number, mode?: Draw) {
        _drawEllipse(pack(x, y), pack(rx, ry), mode)
    }

    export function drawCircle(x: number, y: number, r: number, mode?: Draw) {
        drawEllipse(x, y, r, r, mode)
    }
}