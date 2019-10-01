namespace control {
    export class EulerIntegrator {
        public value: number;
        private t: number;
        private v: number;

        constructor() {
            this.reset();
        }

        public integrate(derivative: number): void {
            let now = control.millis();
            let dt = (this.t - now) / 1000.0;
            this.value += dt * (this.v + derivative) / 2;

            this.t = now;
            this.v = derivative;
        }

        public reset() {
            this.value = 0;
            this.v = 0;
            this.t = control.millis();
        }
    }
}