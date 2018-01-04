/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../node_modules/pxt-core/localtypings/pxtarget.d.ts"/>
/// <reference path="../built/common-sim.d.ts"/>

namespace pxsim {

    export class EV3Board extends CoreBoard {
        view: SVGSVGElement;

        outputState: EV3OutputState;
        analogState: EV3AnalogState;
        uartState: EV3UArtState;
        motorState: EV3MotorState;
        screenState: EV3ScreenState;
        audioState: AudioState;

        inputNodes: SensorNode[] = [];
        brickNode: BrickNode;
        outputNodes: MotorNode[] = [];

        private motorMap: pxt.Map<number> = {
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
            this.screenState = new EV3ScreenState();
            this.audioState = new AudioState();
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
            };
            const viewHost = new visuals.BoardHost(pxsim.visuals.mkBoardView({
                visual: boardDef.visual
            }), opts);

            document.body.innerHTML = ""; // clear children
            document.body.appendChild(this.view = viewHost.getView() as SVGSVGElement);

            this.inputNodes = [];
            this.outputNodes = [];

            return Promise.resolve();
        }

        screenshot(): string {
            return svg.toDataUri(new XMLSerializer().serializeToString(this.view));
        }

        getBrickNode() {
            return this.brickNode;
        }

        motorUsed(port:number, large: boolean) {
            for(let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
                const p = 1 << i;
                if (port & p) {
                    const motorPort = this.motorMap[p];
                    if (!this.outputNodes[motorPort])
                        this.outputNodes[motorPort] = new MotorNode(motorPort, large);
                }    
            }            
        }

        getMotor(port: number, large?: boolean): MotorNode[] {
            const r = [];
            for(let i = 0; i < DAL.NUM_OUTPUTS; ++i) {
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

        getSensor(port: number, type: number): SensorNode {
            if (!this.inputNodes[port]) {
                switch (type) {
                    case DAL.DEVICE_TYPE_GYRO: this.inputNodes[port] = new GyroSensorNode(port); break;
                    case DAL.DEVICE_TYPE_COLOR: this.inputNodes[port] = new ColorSensorNode(port); break;
                    case DAL.DEVICE_TYPE_TOUCH: this.inputNodes[port] = new TouchSensorNode(port); break;
                    case DAL.DEVICE_TYPE_ULTRASONIC: this.inputNodes[port] = new UltrasonicSensorNode(port); break;
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
        }
    }

    export function ev3board(): EV3Board {
        return runtime.board as EV3Board;
    }

    if (!pxsim.initCurrentRuntime) {
        pxsim.initCurrentRuntime = initRuntimeWithDalBoard;
    }
}