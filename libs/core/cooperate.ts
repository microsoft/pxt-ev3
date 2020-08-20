namespace control {
    let lastPause = 0;
    const COOPERATION_INTERVAL = 50
    export function cooperate() {
        const now = control.millis()
        if (now - lastPause > COOPERATION_INTERVAL) {
            pause(1)
            lastPause = now
        }
    }
}