namespace pxsim {
    export class RobotGameTable {
        readonly ctx: CanvasRenderingContext2D;
        readonly data: ImageData;

        cx: number; // cm
        cy: number; // cm
        angle: number; // radians
        cwidth: number; // cm

        constructor(public canvas: HTMLCanvasElement, public scale: number) {
            this.ctx = this.canvas.getContext("2d");
            this.data = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.cx = this.width / 2;
            this.cy = 0;
        }

        /**
         * Gets the width in cm
         */
        get width() { 
            return this.canvas.width * this.scale;
        }

        /**
         * gets the height in cm
         */
        get height() {
            return this.canvas.height * this.scale;
        }

        color(): number {
            // compute color sensor position from center;
            // todo
            const px = Math.max(0, Math.min(this.data.width, (this.cx ) / this.scale));
            const py = Math.max(0, Math.min(this.data.height, (this.cy ) / this.scale));
            // get color
            const i = px * this.data.width + py;
            let c = 
                (this.data.data[i] << 16) | (this.data.data[i + 1] << 8) | (this.data.data[i + 2]);
            // map color to known color
            return c;
        }

        intensity(): number {
            const c = this.color();
            return ((c >> 16 & 0xff) + (c >> 8 & 0xff) + (c & 0xff)) / 3;
        }

        ultrasonicDistance() {
            // obstacles?
            
        }
    }
}