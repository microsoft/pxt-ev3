/// <reference path="./sensor.ts"/>

namespace pxsim {
    export enum InfraredRemoteButton {
        //% block="center beacon"
        CenterBeacon = 0x01,
        //% block="top left"
        TopLeft = 0x02,
        //% block="bottom left"
        BottomLeft = 0x04,
        //% block="top right"
        TopRight = 0x08,
        //% block="bottom right"
        BottomRight = 0x10,
    }    

    export class RemoteState {
        state: number = 0;

        constructor() {
        }

        unmapButtons() {
            switch(this.state) {
                case InfraredRemoteButton.TopLeft: return 1;
                case InfraredRemoteButton.BottomLeft: return 2;
                case InfraredRemoteButton.TopRight: return 3;
                case InfraredRemoteButton.BottomRight: return 4;
                case InfraredRemoteButton.TopLeft | InfraredRemoteButton.TopRight: return 5;
                case InfraredRemoteButton.TopLeft | InfraredRemoteButton.BottomRight: return 6;
                case InfraredRemoteButton.BottomLeft | InfraredRemoteButton.TopRight: return 7;
                case InfraredRemoteButton.BottomLeft | InfraredRemoteButton.BottomRight: return 8;
                case InfraredRemoteButton.CenterBeacon: return 9;                
                case InfraredRemoteButton.BottomLeft | InfraredRemoteButton.TopLeft: return 10;
                case InfraredRemoteButton.TopRight | InfraredRemoteButton.BottomRight: return 11;
                default: return 0;
            }
        }    

        setPressed(btns: InfraredRemoteButton, down: boolean) {
            if (down) this.state = this.state | btns;
            else this.state = ~(~this.state | btns);
        }
    }

    export enum InfraredSensorMode {
        None = -1,
        Proximity = 0,
        Seek = 1,
        RemoteControl = 2
    }

    export class InfraredSensorNode extends UartSensorNode {
        id = NodeType.InfraredSensor;

        private proximity: number = 50; // [0..100]

        constructor(port: number) {
            super(port);
        }

        getDeviceType() {
            return DAL.DEVICE_TYPE_IR;
        }

        setPromixity(proximity: number) {
            if (this.proximity != proximity) {
                this.proximity = proximity;
                this.setChangedState();
            }
        }

        getValue() {
            switch(this.mode) {
                case InfraredSensorMode.Proximity: return this.proximity;
                case InfraredSensorMode.RemoteControl: return ev3board().remoteState.unmapButtons();
                default: return 0;
            }
        }
    }
}