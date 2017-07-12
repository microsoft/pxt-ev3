
namespace pxsim {

    export class EV3ScreenState {
        shouldUpdate: boolean;
        points: {[x: number]: {[y: number]: number}};
        constructor() {
            this.points = {};
        }

        setPixel(x: number, y: number, v: number) {
            if (x < 0 || x > 178) return;
            if (y < 0 || y > 128) return;

            const xPoints = this.points[x]
            if (!xPoints) this.points[x] = {};
            this.points[x][y] = v;
            this.shouldUpdate = true;
        }
    }
}


namespace pxsim.screen {

    export function _setPixel(x: number, y: number, mode: Draw) {
        const screenState = (board() as DalBoard).screenState;
        screenState.setPixel(x, y, mode);
    }


    export function _blitLine(xw: number, y: number, buf: number, mode: Draw) {
        
    }
}