/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../node_modules/pxt-core/localtypings/pxtarget.d.ts"/>
/// <reference path="../built/common-sim.d.ts"/>

namespace pxsim {

    export class EV3Board extends CoreBoard {
        viewHost: visuals.BoardHost;
        view: SVGSVGElement;

        outputState: EV3OutputState;
        analogState: EV3AnalogState;
        uartState: EV3UArtState;
        motorState: EV3MotorState;
        screenState: ScreenState;
        audioState: AudioState;
        remoteState: RemoteState;

        inputNodes: SensorNode[] = [];
        brickNode: BrickNode;
        outputNodes: MotorNode[] = [];

        highcontrastMode?: boolean;
        lightMode?: boolean;

        public motorMap: pxt.Map<number> = {
            0x01: 0,
            0x02: 1,
            0x04: 2,
            0x08: 3
        }

        constructor() {
            super()

            this.bus.setNotify(DAL.DEVICE_ID_NOTIFY, DAL.DEVICE_ID_NOTIFY_ONE);

            this.brickNode = new BrickNode();

            this.outputState = new EV3OutputState();
            this.analogState = new EV3AnalogState();
            this.uartState = new EV3UArtState();
            this.motorState = new EV3MotorState();
            this.screenState = new ScreenState(["#97b5a6", "#000000"], visuals.SCREEN_WIDTH, visuals.SCREEN_HEIGHT);
            this.audioState = new AudioState();
            this.remoteState = new RemoteState();
        }

        receiveMessage(msg: SimulatorMessage) {
            if (!runtime || runtime.dead) return;

            switch (msg.type || "") {
                case "eventbus": {
                    let ev = <SimulatorEventBusMessage>msg;
                    this.bus.queue(ev.id, ev.eventid, ev.value);
                    break;
                }
                case "serial": {
                    let data = (<SimulatorSerialMessage>msg).data || "";
                    // TODO
                    break;
                }
            }
        }

        initAsync(msg: SimulatorRunMessage): Promise<void> {
            super.initAsync(msg);

            const options = (msg.options || {}) as pxt.RuntimeOptions;

            const boardDef = msg.boardDefinition;
            const cmpsList = msg.parts;
            const cmpDefs = msg.partDefinitions || {};
            const fnArgs = msg.fnArgs;

            const opts: visuals.BoardHostOpts = {
                state: this,
                boardDef: boardDef,
                partsList: cmpsList,
                partDefs: cmpDefs,
                fnArgs: fnArgs,
                maxWidth: "100%",
                maxHeight: "100%",
                highContrast: msg.highContrast,
                light: msg.light
            };
            const viewHost = new visuals.BoardHost(pxsim.visuals.mkBoardView({
                boardDef,
                visual: boardDef.visual,
                boardDef,
                highContrast: msg.highContrast,
                light: msg.light
            }), opts);

            document.body.innerHTML = ""; // clear children
            document.body.className = msg.light ? "light" : "";
            document.body.appendChild(this.view = this.viewHost.getView() as SVGSVGElement);

            this.inputNodes = [];
            this.outputNodes = [];

            this.highcontrastMode = msg.highContrast;
            this.lightMode = msg.light;

            return Promise.resolve();
        }

        screenshotAsync(width?: number): Promise<ImageData> {
            return this.viewHost.screenshotAsync(width);
        }

        getBrickNode() {
            return this.brickNode;
        }

        motorUsed(ports: number, large: boolean): boolean {
            for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
                const p = 1 << i;
                if (ports & p) {
                    const motorPort = this.motorMap[p];
                    const outputNode = this.outputNodes[motorPort];
                    if (!outputNode) {
                        this.outputNodes[motorPort] = new MotorNode(motorPort, large);
                        continue;
                    }
                    if (outputNode && outputNode.isLarge() != large)
                        return false;
                }
            }
            return true;
        }

        getMotor(port: number, large?: boolean): MotorNode[] {
            const r = [];
            for (let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
                const p = 1 << i;
                if (port & p) {
                    const motorPort = this.motorMap[p];
                    const outputNode = this.outputNodes[motorPort];
                    if (outputNode)
                        r.push(outputNode);
                }
            }
            return r;
        }

        getMotors() {
            return this.outputNodes;
        }

        hasSensor(port: number) {
            return !!this.inputNodes[port];
        }

        getSensor(port: number, type: number): SensorNode {
            if (!this.inputNodes[port]) {
                switch (type) {
                    case DAL.DEVICE_TYPE_GYRO: this.inputNodes[port] = new GyroSensorNode(port); break;
                    case DAL.DEVICE_TYPE_COLOR: this.inputNodes[port] = new ColorSensorNode(port); break;
                    case DAL.DEVICE_TYPE_TOUCH: this.inputNodes[port] = new TouchSensorNode(port); break;
                    case DAL.DEVICE_TYPE_ULTRASONIC: this.inputNodes[port] = new UltrasonicSensorNode(port); break;
                    case DAL.DEVICE_TYPE_IR: this.inputNodes[port] = new InfraredSensorNode(port); break;
                }
            }
            return this.inputNodes[port];
        }

        getInputNodes() {
            return this.inputNodes;
        }
    }

    export function initRuntimeWithDalBoard() {
        U.assert(!runtime.board);
        let b = new EV3Board();
        runtime.board = b;
        runtime.postError = (e) => {
            // TODO
            runtime.updateDisplay();
            console.log('runtime error: ' + e);
        }
    }

    export function ev3board(): EV3Board {
        return runtime.board as EV3Board;
    }

    export function inLightMode(): boolean {
        return /light=1/i.test(window.location.href) || ev3board().lightMode;
    }

    export function inHighcontrastMode(): boolean {
        return ev3board().highcontrastMode;
    }

    if (!pxsim.initCurrentRuntime) {
        pxsim.initCurrentRuntime = initRuntimeWithDalBoard;
    }
}