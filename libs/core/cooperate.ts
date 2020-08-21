namespace control {
    let lastPause = 0;
    const COOPERATION_INTERVAL = 20
    export function cooperate() {
        const now = control.millis()
        if (now - lastPause > COOPERATION_INTERVAL) {
            lastPause = now
            pause(1)
        }
    }
}