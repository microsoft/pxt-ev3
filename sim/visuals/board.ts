namespace pxsim.visuals {
    const MB_STYLE = `
        svg.sim {
            margin-bottom:1em;
        }
        svg.sim.grayscale {
            -moz-filter: grayscale(1);
            -webkit-filter: grayscale(1);
            filter: grayscale(1);
        }
        .sim-button {
            cursor: pointer;
        }
        .sim-button:hover {
            stroke-width: 2px !important;
            stroke: white !important;
        }

        .sim-systemled {
            fill:#333;
            stroke:#555;
            stroke-width: 1px;
        }

        .sim-light-level-button {
            stroke:#f1c40f;
            stroke-width: 1px;
        }

        .sim-pin-level-button {
            stroke:darkorange;
            stroke-width: 1px;
        }

        .sim-sound-level-button {
            stroke:#7f8c8d;
            stroke-width: 1px;
        }

        .sim-antenna {
            stroke:#555;
            stroke-width: 2px;
        }

        .sim-text {
            font-family:"Lucida Console", Monaco, monospace;
            font-size:8px;
            fill:#fff;
            pointer-events: none; user-select: none;
        }
        .sim-text.small {
            font-size:6px;
        }
        .sim-text.inverted {
            fill:#000;
        }

        .sim-text-pin {
            font-family:"Lucida Console", Monaco, monospace;
            font-size:5px;
            fill:#fff;
            pointer-events: none;
        }

        .sim-thermometer {
            stroke:#aaa;
            stroke-width: 1px;
        }

        #rgbledcircle:hover {
            r:8px;
        }

        #SLIDE_HOVER {
            cursor: pointer;
        }
        .sim-slide-switch:hover #SLIDE_HOVER {
            stroke:orange !important;
            stroke-width: 1px;
        }

        .sim-slide-switch-inner.on {
            fill:#ff0000 !important;
        }

        /* animations */
        .sim-theme-glow {
            animation-name: sim-theme-glow-animation;
            animation-timing-function: ease-in-out;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            animation-duration: 1.25s;
        }
        @keyframes sim-theme-glow-animation {
            from { opacity: 1; }
            to   { opacity: 0.75; }
        }

        .sim-flash {
            animation-name: sim-flash-animation;
            animation-duration: 0.1s;
        }

        @keyframes sim-flash-animation {
            from { fill: yellow; }
            to   { fill: default; }
        }

        .sim-flash-stroke {
            z-index: 0;
            animation-name: sim-flash-stroke-animation;
            animation-duration: 0.4s;
            animation-timing-function: ease-in;
        }

        @keyframes sim-flash-stroke-animation {
            from { stroke: yellow; }
            to   { stroke: default; }
        }


        .sim-sound-stroke {
            animation-name: sim-sound-stroke-animation;
            animation-duration: 0.4s;
        }

        @keyframes sim-sound-stroke-animation {
            from { stroke: yellow; }
            to   { stroke: default; }
        }

        /* wireframe */
        .sim-wireframe * {
            fill: none;
            stroke: black;
        }
        .sim-wireframe .sim-display,
        .sim-wireframe .sim-led,
        .sim-wireframe .sim-led-back,
        .sim-wireframe .sim-head,
        .sim-wireframe .sim-theme,
        .sim-wireframe .sim-button-group,
        .sim-wireframe .sim-button-label,
        .sim-wireframe .sim-button,
        .sim-wireframe .sim-text-pin
        {
            visibility: hidden;
        }
        .sim-wireframe .sim-label
        {
            stroke: none;
            fill: #777;
        }
        .sim-wireframe .sim-board {
            stroke-width: 2px;
        }
    `;

    const pinNames: { 'name': string, 'touch': number, 'text': any, 'id'?: number, tooltip?: string }[] = [
        { 'name': "PIN_A0", 'touch': 0, 'text': null, 'id': pxsim.CPlayPinName.A0, tooltip: "A0 - Speaker" },
        { 'name': "PIN_A1", 'touch': 1, 'text': null, 'id': pxsim.CPlayPinName.A1, tooltip: "~A1" },
        { 'name': "PIN_A2", 'touch': 1, 'text': null, 'id': pxsim.CPlayPinName.A2, tooltip: "~A2" },
        { 'name': "PIN_A3", 'touch': 1, 'text': null, 'id': pxsim.CPlayPinName.A3, tooltip: "~A3" },
        { 'name': "PIN_A4", 'touch': 1, 'text': null, 'id': pxsim.CPlayPinName.A4, tooltip: "A4 - SCL" },
        { 'name': "PIN_A5", 'touch': 1, 'text': null, 'id': pxsim.CPlayPinName.A5, tooltip: "A5 - SDA" },
        { 'name': "PIN_A6", 'touch': 1, 'text': null, 'id': pxsim.CPlayPinName.A6, tooltip: "A6 - RX" },
        { 'name': "PIN_A7", 'touch': 1, 'text': null, 'id': pxsim.CPlayPinName.A7, tooltip: "A7 - TX" },
        { 'name': "GND_0", 'touch': 0, 'text': null, tooltip: "Ground" },
        { 'name': "GND_1", 'touch': 0, 'text': null, tooltip: "Ground" },
        { 'name': "GND_2", 'touch': 0, 'text': null, tooltip: "Ground" },
        { 'name': "VBATT", 'touch': 0, 'text': null, tooltip: "Battery power" },
        { 'name': "PWR_0", 'touch': 0, 'text': null, tooltip: "+3.3V" },
        { 'name': "PWR_1", 'touch': 0, 'text': null, tooltip: "+3.3V" },
        { 'name': "PWR_2", 'touch': 0, 'text': null, tooltip: "+3.3V" }
    ];
    const MB_WIDTH = 99.984346;
    const MB_HEIGHT = 151.66585;
    const SCREEN_WIDTH = 178;
    const SCREEN_HEIGHT = 128;
    export interface IBoardTheme {
        accent?: string;
        display?: string;
        pin?: string;
        pinTouched?: string;
        pinActive?: string;
        ledOn?: string;
        ledOff?: string;
        buttonOuter?: string;
        buttonUps: string[];
        buttonDown?: string;
        virtualButtonOuter?: string;
        virtualButtonUp?: string;
        virtualButtonDown?: string;
        lightLevelOn?: string;
        lightLevelOff?: string;
        soundLevelOn?: string;
        soundLevelOff?: string;
        gestureButtonOn?: string;
        gestureButtonOff?: string;
    }

    export var themes: IBoardTheme[] = ["#3ADCFE"].map(accent => {
        return {
            accent: accent,
            pin: "#D4AF37",
            pinTouched: "#FFA500",
            pinActive: "#FF5500",
            ledOn: "#ff7777",
            ledOff: "#fff",
            buttonOuter: "#979797",
            buttonUps: ["#FFF", "#4D4D4D", "#FFF", "#FFF", "#FFF", "#FFF", '#FFF'],
            buttonDown: "#000",
            virtualButtonDown: "#FFA500",
            virtualButtonOuter: "#333",
            virtualButtonUp: "#FFF",
            lightLevelOn: "yellow",
            lightLevelOff: "#555",
            soundLevelOn: "#7f8c8d",
            soundLevelOff: "#555",
            gestureButtonOn: "#FFA500",
            gestureButtonOff: "#B4009E"
        }
    });

    export function randomTheme(): IBoardTheme {
        return themes[Math.floor(Math.random() * themes.length)];
    }

    export interface IBoardProps {
        runtime?: pxsim.Runtime;
        theme?: IBoardTheme;
        disableTilt?: boolean;
        wireframe?: boolean;
    }

    export class EV3BoardSvg implements BoardView {
        public element: SVGSVGElement;
        private style: SVGStyleElement;
        private defs: SVGDefsElement;
        private g: SVGGElement;

        private buttons: SVGElement[];
        private buttonABText: SVGTextElement;
        private light: SVGElement;
        private screenCanvas: HTMLCanvasElement;
        private screenCanvasCtx: CanvasRenderingContext2D;
        private screenCanvasData: ImageData;
        private screenXYText: SVGTextElement;
        private pins: SVGElement[];
        private pinControls: { [index: number]: AnalogPinControl };
        private systemLed: SVGCircleElement;
        private irReceiver: SVGElement;
        private irTransmitter: SVGElement;
        private redLED: SVGRectElement;
        private slideSwitch: SVGGElement;
        private lightLevelButton: SVGCircleElement;
        private lightLevelGradient: SVGLinearGradientElement;
        private lightLevelText: SVGTextElement;
        private soundLevelButton: SVGCircleElement;
        private soundLevelGradient: SVGLinearGradientElement;
        private soundLevelText: SVGTextElement;
        private thermometerGradient: SVGLinearGradientElement;
        private thermometer: SVGRectElement;
        private thermometerText: SVGTextElement;
        private antenna: SVGPolylineElement;
        private shakeButtonGroup: SVGElement;
        private shakeText: SVGTextElement;
        public board: pxsim.DalBoard;
        private pinNmToCoord: Map<Coord> = {
        };

        constructor(public props: IBoardProps) {
            this.buildDom();
            if (props && props.wireframe)
                svg.addClass(this.element, "sim-wireframe");

            /*
            if (props && props.theme)
                this.updateTheme();
            */
            if (props && props.runtime) {
                this.board = this.props.runtime.board as pxsim.DalBoard;
                this.board.updateSubscribers.push(() => this.updateState());
                this.updateState();
                this.attachEvents();
            }
        }

        public getView(): SVGAndSize<SVGSVGElement> {
            return {
                el: this.element,
                y: 0,
                x: 0,
                w: MB_WIDTH,
                h: MB_HEIGHT
            };
        }

        public getCoord(pinNm: string): Coord {
            return this.pinNmToCoord[pinNm];
        }

        public highlightPin(pinNm: string): void {
            //TODO: for instructions
        }

        public getPinDist(): number {
            return 10;
        }

        private recordPinCoords() {
            pinNames.forEach((pin, i) => {
                const nm = pin.name;
                const p = this.pins[i];
                const r = p.getBoundingClientRect();
                this.pinNmToCoord[nm] = [r.left + r.width / 2, r.top + r.height / 2];
            });
            console.log(JSON.stringify(this.pinNmToCoord, null, 2))
        }

        private updateTheme() {
            let theme = this.props.theme;

            svg.fill(this.buttons[0], theme.buttonUps[0]);
            svg.fill(this.buttons[1], theme.buttonUps[1]);
            svg.fill(this.buttons[2], theme.buttonUps[2]);

            if (this.shakeButtonGroup) {
                svg.fill(this.shakeButtonGroup, this.props.theme.gestureButtonOff);
            }

            svg.setGradientColors(this.lightLevelGradient, theme.lightLevelOn, theme.lightLevelOff);

            svg.setGradientColors(this.thermometerGradient, theme.ledOff, theme.ledOn);
            svg.setGradientColors(this.soundLevelGradient, theme.soundLevelOn, theme.soundLevelOff);

            for (const id in this.pinControls) {
                this.pinControls[id].updateTheme();
            }
        }

        public updateState() {
            let state = this.board;
            if (!state) return;
            let theme = this.props.theme;

            let bpState = state.buttonState;
            let buttons = bpState.buttons;
            this.buttons.forEach((button, i) => {
                svg.fill(button, buttons[i].pressed ? theme.buttonDown : theme.buttonUps[i]);
            })

            this.updateLight();
            this.updateScreen();
            /*
            
            this.updatePins();
            this.updateTilt();
            this.updateNeoPixels();
            this.updateSwitch();
            this.updateSound();
            this.updateLightLevel();
            this.updateSoundLevel();
            this.updateButtonAB();
            this.updateGestures();
            this.updateTemperature();
            this.updateInfrared();
            */

            if (!runtime || runtime.dead) svg.addClass(this.element, "grayscale");
            else svg.removeClass(this.element, "grayscale");
        }

        private lastFlashTime: number = 0;
        private flashSystemLed() {
            /*
            if (!this.systemLed)
                this.systemLed = <SVGCircleElement>svg.child(this.g, "circle", { class: "sim-systemled", cx: 75, cy: MB_HEIGHT - 171, r: 2 })
            let now = Date.now();
            if (now - this.lastFlashTime > 150) {
                this.lastFlashTime = now;
                svg.animate(this.systemLed, "sim-flash")
            }
            */
        }

        private lastIrReceiverFlash: number = 0;
        public flashIrReceiver() {
            /*
            if (!this.irReceiver)
                this.irReceiver = this.element.getElementById("path2054") as SVGElement;
            let now = Date.now();
            if (now - this.lastIrReceiverFlash > 200) {
                this.lastIrReceiverFlash = now;
                svg.animate(this.irReceiver, 'sim-flash-stroke')
            }
            */
        }

        private lastIrTransmitterFlash: number = 0;
        public flashIrTransmitter() {
            /*
            if (!this.irTransmitter)
                this.irTransmitter = this.element.getElementById("path2062") as SVGElement;
            let now = Date.now();
            if (now - this.lastIrTransmitterFlash > 200) {
                this.lastIrTransmitterFlash = now;
                svg.animate(this.irTransmitter, 'sim-flash-stroke')
            }*/
        }

        private updateInfrared() {
            const state = this.board;
            if (!state) return;

            if (state.irState.packetReceived) {
                state.irState.packetReceived = false;
                this.flashIrReceiver();
            }
        }

        private lastLightPattern: number = -1;
        private updateLight() {
            let state = this.board;
            if (!state || !state.lightState) return;

            const lightPattern = state.lightState.lightPattern;
            if (lightPattern == this.lastLightPattern) return;
            this.lastLightPattern = lightPattern;
            switch(lightPattern) {
                case 0:  // LED_BLACK
                    svg.fill(this.light, "#FFF");
                    break;
                case 1:  // LED_GREEN
                    svg.fill(this.light, "#00ff00");
                    break;
                case 2:  // LED_RED
                    svg.fill(this.light, "#ff0000");
                    break;
                case 3:  // LED_ORANGE
                    svg.fill(this.light, "#FFA500");
                    break;
                case 4:  // LED_GREEN_FLASH
                    break;
                case 5:  // LED_RED_FLASH
                    break;
                case 6:  // LED_ORANGE_FLASH
                    break;
                case 7:  // LED_GREEN_PULSE
                    break;
                case 8:  // LED_RED_PULSE
                    break;
                case 9:  // LED_ORANGE_PULSE
                    break;
            }
        }

        private updateScreen() {
            let state = this.board;
            if (!state || !state.screenState) return;

            this.screenCanvasData = this.screenCanvasCtx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

            Object.keys(state.screenState.points).forEach(xStr => {
                const x = parseInt(xStr);
                Object.keys(state.screenState.points[x]).forEach(yStr => {
                    const y = parseInt(yStr);
                    
                    const point = state.screenState.points[x][y];
                    const r = 0;
                    const g = 0;
                    const b = 0;
                    const a = 255;

                    var index = (x + y * SCREEN_WIDTH) * 4;
                    this.screenCanvasData.data[index + 0] = r;
                    this.screenCanvasData.data[index + 1] = g;
                    this.screenCanvasData.data[index + 2] = b;
                    this.screenCanvasData.data[index + 3] = a;
                })
            })

            this.screenCanvasCtx.putImageData(this.screenCanvasData, 0, 0);
        }

        private updateNeoPixels() {
            let state = this.board;
            if (!state || !state.neopixelState) return;
            let neopixels = state.neopixelState.getNeoPixels();
            for (let i = 0; i < state.neopixelState.NUM_PIXELS; i++) {
                let rgb = neopixels[i];
                let p_inner = this.element.getElementById(`LED${i}`) as SVGPathElement;

                if (!rgb || (rgb.length == 3 && rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0)) {
                    // Clear the pixel
                    svg.fill(p_inner, `rgb(200,200,200)`);
                    svg.filter(p_inner, null);
                    p_inner.style.stroke = `none`
                    continue;
                }

                let hsl = visuals.rgbToHsl(rgb);
                let [h, s, l] = hsl;
                let lx = Math.max(l * 1.3, 85);
                // at least 10% luminosity
                l = l * 90 / 100 + 10;
                if (p_inner) {
                    p_inner.style.stroke = `hsl(${h}, ${s}%, ${Math.min(l * 3, 75)}%)`
                    p_inner.style.strokeWidth = "1.5";
                    svg.fill(p_inner, `hsl(${h}, ${s}%, ${lx}%)`)
                }
                if (p_inner) svg.filter(p_inner, `url(#neopixelglow)`);
            }
        }

        private updateSound() {
            let state = this.board;
            if (!state || !state.audioState) return;
            let audioState = state.audioState;

            // FIXME
            // let soundBoard = this.element.getElementById('g4656') as SVGGElement;
            // if (audioState.isPlaying()) {
            //     svg.addClass(soundBoard, "sim-sound-stroke");
            // } else {
            //     svg.removeClass(soundBoard, "sim-sound-stroke");
            // }
        }

        private updatePins() {
            let state = this.board;
            if (!state || !state.edgeConnectorState || !state.capacitiveSensorState) return;
            state.edgeConnectorState.pins.forEach((pin, i) => this.updatePin(pin, i));
        }

        private updatePin(pin: Pin, index: number) {
            if (!pin || !this.pins[index]) return;

            if ((pin as pins.CommonPin).used) {
                if (this.pinControls[pin.id] === undefined) {
                    const pinName = pinNames.filter((a) => a.id === pin.id)[0];
                    if (pinName) {
                        this.pinControls[pin.id] = new AnalogPinControl(this, this.defs, pin.id, pinName.name);
                    }
                    else {
                        // TODO: Surface pin controls for sensor pins in some way?
                        this.pinControls[pin.id] = null;
                    }
                }

                if (this.pinControls[pin.id]) {
                    this.pinControls[pin.id].updateValue();
                }
            }
        }

        private updateLightLevel() {
            let state = this.board;
            if (!state || !state.lightSensorState.sensorUsed) return;

            if (!this.lightLevelButton) {
                let gid = "gradient-light-level";
                this.lightLevelGradient = svg.linearGradient(this.defs, gid)
                let cy = 15;
                let r = 10;
                this.lightLevelButton = svg.child(this.g, "circle", {
                    cx: `12px`, cy: `${cy}px`, r: `${r}px`,
                    class: 'sim-light-level-button',
                    fill: `url(#${gid})`
                }) as SVGCircleElement;
                let pt = this.element.createSVGPoint();
                svg.buttonEvents(this.lightLevelButton,
                    (ev) => {
                        let pos = svg.cursorPoint(pt, this.element, ev);
                        let rs = r / 2;
                        let level = Math.max(0, Math.min(255, Math.floor((pos.y - (cy - rs)) / (2 * rs) * 255)));
                        if (level != this.board.lightSensorState.getLevel()) {
                            this.board.lightSensorState.setLevel(level);
                            this.applyLightLevel();
                        }
                    }, ev => { },
                    ev => { })
                this.lightLevelText = svg.child(this.g, "text", { x: 23, y: cy + r - 15, text: '', class: 'sim-text' }) as SVGTextElement;
                this.updateTheme();
            }

            svg.setGradientValue(this.lightLevelGradient, Math.min(100, Math.max(0, Math.floor(state.lightSensorState.getLevel() * 100 / 255))) + '%')
            this.lightLevelText.textContent = state.lightSensorState.getLevel().toString();
        }

        private applyLightLevel() {
            let lv = this.board.lightSensorState.getLevel();
            svg.setGradientValue(this.lightLevelGradient, Math.min(100, Math.max(0, Math.floor(lv * 100 / 255))) + '%')
            this.lightLevelText.textContent = lv.toString();
        }

        private updateSoundLevel() {
            let state = this.board;
            if (!state || !state.microphoneState.sensorUsed) return;

            if (!this.soundLevelButton) {
                let gid = "gradient-sound-level";
                this.soundLevelGradient = svg.linearGradient(this.defs, gid)
                let cy = 165;
                let r = 10;
                this.soundLevelButton = svg.child(this.g, "circle", {
                    cx: `12px`, cy: `${cy}px`, r: `${r}px`,
                    class: 'sim-sound-level-button',
                    fill: `url(#${gid})`
                }) as SVGCircleElement;

                let pt = this.element.createSVGPoint();
                svg.buttonEvents(this.soundLevelButton,
                    (ev) => {
                        let pos = svg.cursorPoint(pt, this.element, ev);
                        let rs = r / 2;
                        let level = Math.max(0, Math.min(255, Math.floor((pos.y - (cy - rs)) / (2 * rs) * 255)));
                        if (level != this.board.microphoneState.getLevel()) {
                            this.board.microphoneState.setLevel(255 - level);
                            this.applySoundLevel();
                        }
                    }, ev => { },
                    ev => { })
                this.soundLevelText = svg.child(this.g, "text", { x: 23, y: cy + r - 3, text: '', class: 'sim-text' }) as SVGTextElement;
                this.updateTheme();
            }

            svg.setGradientValue(this.soundLevelGradient, Math.min(100, Math.max(0, Math.floor((255 - state.microphoneState.getLevel()) * 100 / 255))) + '%')
            this.soundLevelText.textContent = state.microphoneState.getLevel().toString();
        }

        private applySoundLevel() {
            let lv = this.board.microphoneState.getLevel();
            svg.setGradientValue(this.soundLevelGradient, Math.min(100, Math.max(0, Math.floor((255 - lv) * 100 / 255))) + '%')
            this.soundLevelText.textContent = lv.toString();
        }

        private updateTemperature() {
            let state = this.board;
            if (!state || !state.thermometerState || !state.thermometerState.sensorUsed) return;

            // Celsius
            let tmin = -5;
            let tmax = 50;
            if (!this.thermometer) {
                let gid = "gradient-thermometer";
                this.thermometerGradient = svg.linearGradient(this.defs, gid);
                this.thermometer = <SVGRectElement>svg.child(this.g, "rect", {
                    class: "sim-thermometer",
                    x: 170,
                    y: 3,
                    width: 7,
                    height: 32,
                    rx: 2, ry: 2,
                    fill: `url(#${gid})`
                });
                this.thermometerText = svg.child(this.g, "text", { class: 'sim-text', x: 148, y: 10 }) as SVGTextElement;
                this.updateTheme();

                let pt = this.element.createSVGPoint();
                svg.buttonEvents(this.thermometer,
                    (ev) => {
                        let cur = svg.cursorPoint(pt, this.element, ev);
                        let t = Math.max(0, Math.min(1, (35 - cur.y) / 30))
                        state.thermometerState.setLevel(Math.floor(tmin + t * (tmax - tmin)));
                        this.updateTemperature();
                    }, ev => { }, ev => { })
            }

            let t = Math.max(tmin, Math.min(tmax, state.thermometerState.getLevel()))
            let per = Math.floor((state.thermometerState.getLevel() - tmin) / (tmax - tmin) * 100)
            svg.setGradientValue(this.thermometerGradient, 100 - per + "%");

            let unit = "°C";
            if (state.thermometerUnitState == pxsim.TemperatureUnit.Fahrenheit) {
                unit = "°F";
                t = ((t * 18) / 10 + 32) >> 0;
            }
            this.thermometerText.textContent = t + unit;
        }

        private updateButtonAB() {
            let state = this.board;
            if (state.buttonState.usesButtonAB) {
                (<any>this.buttons[2]).style.visibility = "visible";
                this.updateTheme();
            }
        }

        private updateGestures() {
            let state = this.board;
            if (state.accelerometerState.useShake && !this.shakeButtonGroup) {
                const btnr = 2;
                const width = 22;
                const height = 10;

                let btng = svg.child(this.g, "g", { class: "sim-button-group" });
                this.shakeButtonGroup = btng;
                this.shakeText = svg.child(this.g, "text", { x: 81, y: 32, class: "sim-text small" }) as SVGTextElement;
                this.shakeText.textContent = "SHAKE"

                svg.child(btng, "rect", { class: "sim-button", x: 79, y: 25, rx: btnr, ry: btnr, width, height });
                svg.fill(btng, this.props.theme.gestureButtonOff);
                this.shakeButtonGroup.addEventListener(pointerEvents.down, ev => {
                    let state = this.board;
                    svg.fill(btng, this.props.theme.gestureButtonOn);
                    svg.addClass(this.shakeText, "inverted");
                })
                this.shakeButtonGroup.addEventListener(pointerEvents.leave, ev => {
                    let state = this.board;
                    svg.fill(btng, this.props.theme.gestureButtonOff);
                    svg.removeClass(this.shakeText, "inverted");
                })
                this.shakeButtonGroup.addEventListener(pointerEvents.up, ev => {
                    let state = this.board;
                    svg.fill(btng, this.props.theme.gestureButtonOff);
                    //this.board.bus.queue(DAL.DEVICE_ID_GESTURE, 11); // GESTURE_SHAKE
                    svg.removeClass(this.shakeText, "inverted");
                })
            }
        }

        private updateTilt() {
            if (this.props.disableTilt) return;
            let state = this.board;
            if (!state || !state.accelerometerState.accelerometer.isActive) return;

            const x = state.accelerometerState.accelerometer.getX();
            const y = state.accelerometerState.accelerometer.getY();
            const af = 8 / 1023;
            const s = 1 - Math.min(0.1, Math.pow(Math.max(Math.abs(x), Math.abs(y)) / 1023, 2) / 35);

            this.element.style.transform = `perspective(30em) rotateX(${y * af}deg) rotateY(${x * af}deg) scale(${s}, ${s})`
            this.element.style.perspectiveOrigin = "50% 50% 50%";
            this.element.style.perspective = "30em";
        }

        private updateXY() {
            this.screenXYText.textContent = `x:${this.currentCanvasX}, y:${this.currentCanvasY}`;
        }

        private currentCanvasX = 178;
        private currentCanvasY = 128;
        private buildDom() {
            this.element = new DOMParser().parseFromString(BOARD_SVG, "image/svg+xml").querySelector("svg") as SVGSVGElement;
            svg.hydrate(this.element, {
                "version": "1.0",
                "viewBox": `0 0 ${MB_WIDTH} ${MB_HEIGHT}`,
                "class": "sim",
                "x": "0px",
                "y": "0px",
                "width": MB_WIDTH + "px",
                "height": MB_HEIGHT + "px",
            });
            this.style = <SVGStyleElement>svg.child(this.element, "style", {});
            this.style.textContent = MB_STYLE;

            this.defs = <SVGDefsElement>svg.child(this.element, "defs", {});
            this.g = <SVGGElement>svg.elt("g");
            this.element.appendChild(this.g);

            const btnids = ["BTN_4", "BTN_2", "BTN_5", "BTN_3", "BTN_1", "BTN_BACK"];
            this.buttons = btnids.map(n => this.element.getElementById(n) as SVGElement);
            this.buttons.forEach(b => svg.addClass(b, "sim-button"));

            this.light = this.element.getElementById("BOARD_Light") as SVGElement;

            const screen = this.element.getElementById("Screen");
            const foreignObjectG = svg.child(screen, "g", {
                transform: "scale(1.75)"
            })
            const foreignObject = svg.child(foreignObjectG, "foreignObject", {
                x: "119", y: "105", width: "178", height: "128"
            });

            const foBody = document.createElementNS("http://www.w3.org/1999/xhtml", "body") as HTMLElement;
            foBody.style.width = `${SCREEN_WIDTH}px`;
            foBody.style.height = `${SCREEN_HEIGHT}px`;
            foBody.style.position = 'fixed';
            foBody.style.backgroundColor = `none`;
            foreignObject.appendChild(foBody);

            this.screenCanvas = document.createElement("canvas");
            this.screenCanvas.id = "Screen_canvas";
            this.screenCanvas.style.cursor = "crosshair";
            this.screenCanvas.onmousemove = (e: MouseEvent) => {
                const x = e.clientX;
                const y = e.clientY;
                this.currentCanvasX = x;
                this.currentCanvasY = y;
                this.updateXY();
            }
            this.screenCanvas.onmouseleave = () => {
                this.currentCanvasX = SCREEN_WIDTH;
                this.currentCanvasY = SCREEN_HEIGHT;
                this.updateXY();
            }
            foBody.appendChild(this.screenCanvas);
            //foreignObject.appendChild(this.screenCanvas);

            this.screenCanvas.width = SCREEN_WIDTH;
            this.screenCanvas.height = SCREEN_HEIGHT;
            this.screenCanvasCtx = this.screenCanvas.getContext("2d");

            this.screenXYText = this.element.getElementById('xyPos') as SVGTextElement;
            this.updateXY();
        }

        private attachEvents() {
            Runtime.messagePosted = (msg) => {
                switch (msg.type || "") {
                    case "serial": this.flashSystemLed(); break;
                    case "irpacket": this.flashIrTransmitter(); break;
                }
            }

            /*
            let tiltDecayer = 0;
            this.element.addEventListener(pointerEvents.move, (ev: MouseEvent) => {
                let state = this.board;
                if (!state.accelerometerState.accelerometer.isActive) return;

                if (tiltDecayer) {
                    clearInterval(tiltDecayer);
                    tiltDecayer = 0;
                }

                let bbox = this.element.getBoundingClientRect();
                let ax = (ev.clientX - bbox.width / 2) / (bbox.width / 3);
                let ay = (ev.clientY - bbox.height / 2) / (bbox.height / 3);

                let x = - Math.max(- 1023, Math.min(1023, Math.floor(ax * 1023)));
                let y = Math.max(- 1023, Math.min(1023, Math.floor(ay * 1023)));
                let z2 = 1023 * 1023 - x * x - y * y;
                let z = Math.floor((z2 > 0 ? -1 : 1) * Math.sqrt(Math.abs(z2)));

                state.accelerometerState.accelerometer.update(x, y, z);
                this.updateTilt();
            }, false);
            this.element.addEventListener(pointerEvents.leave, (ev: MouseEvent) => {
                let state = this.board;
                if (!state.accelerometerState.accelerometer.isActive) return;

                if (!tiltDecayer) {
                    tiltDecayer = setInterval(() => {
                        let accx = state.accelerometerState.accelerometer.getX(MicroBitCoordinateSystem.RAW);
                        accx = Math.floor(Math.abs(accx) * 0.85) * (accx > 0 ? 1 : -1);
                        let accy = state.accelerometerState.accelerometer.getY(MicroBitCoordinateSystem.RAW);
                        accy = Math.floor(Math.abs(accy) * 0.85) * (accy > 0 ? 1 : -1);
                        let accz = -Math.sqrt(Math.max(0, 1023 * 1023 - accx * accx - accy * accy));
                        if (Math.abs(accx) <= 24 && Math.abs(accy) <= 24) {
                            clearInterval(tiltDecayer);
                            tiltDecayer = 0;
                            accx = 0;
                            accy = 0;
                            accz = -1023;
                        }
                        state.accelerometerState.accelerometer.update(accx, accy, accz);
                        this.updateTilt();
                    }, 50)
                }
            }, false);
            */
            let bpState = this.board.buttonState;
            let stateButtons = bpState.buttons;
            this.buttons.forEach((btn, index) => {
                let button = stateButtons[index];

                btn.addEventListener(pointerEvents.down, ev => {
                    button.setPressed(true);
                    svg.fill(this.buttons[index], this.props.theme.buttonDown);
                })
                btn.addEventListener(pointerEvents.leave, ev => {
                    button.setPressed(false);
                    svg.fill(this.buttons[index], this.props.theme.buttonUps[index]);
                })
                btn.addEventListener(pointerEvents.up, ev => {
                    button.setPressed(false);
                    svg.fill(this.buttons[index], this.props.theme.buttonUps[index]);
                })
            })
        }
    }
}