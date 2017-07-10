const enum IrSensorMode {
    None = -1,
    Proximity = 0,
    Seek = 1,
    RemoteControl = 2,
}

const enum IrRemoteChannel {
    Ch0 = 0, // top
    Ch1 = 1,
    Ch2 = 2,
    Ch3 = 3,
}

const enum IrRemoteButton {
    None = 0x00,
    CenterBeacon = 0x01,
    TopLeft = 0x02,
    BottomLeft = 0x04,
    TopRight = 0x08,
    BottomRight = 0x10,
}

namespace input {
    function mapButton(v: number) {
        switch (v) {
            case 0: return IrRemoteButton.None
            case 1: return IrRemoteButton.TopLeft
            case 2: return IrRemoteButton.BottomLeft
            case 3: return IrRemoteButton.TopRight
            case 4: return IrRemoteButton.TopRight | IrRemoteButton.BottomRight
            case 5: return IrRemoteButton.TopLeft | IrRemoteButton.TopRight
            case 6: return IrRemoteButton.TopLeft | IrRemoteButton.BottomRight
            case 7: return IrRemoteButton.BottomLeft | IrRemoteButton.TopRight
            case 8: return IrRemoteButton.BottomLeft | IrRemoteButton.BottomRight
            case 9: return IrRemoteButton.CenterBeacon
            case 10: return IrRemoteButton.BottomLeft | IrRemoteButton.TopLeft
            case 11: return IrRemoteButton.TopRight | IrRemoteButton.BottomRight
            default: return IrRemoteButton.None
        }
    }

    export class IrSensor extends internal.UartSensor {
        private channel: IrRemoteChannel
        private pollRunning: boolean
        private buttons: ButtonTS[];

        constructor() {
            super()
            this.channel = IrRemoteChannel.Ch0
            this.buttons = []
            // otherwise button events won't work
            this.mode = IrSensorMode.RemoteControl
            for (let i = 0; i < 5; ++i) {
                this.buttons.push(new ButtonTS())
            }
        }

        button(id: IrRemoteButton) {
            let num = -1
            while (id) {
                id >>= 1;
                num++;
            }
            num = Math.clamp(0, this.buttons.length - 1, num)
            return this.buttons[num]
        }

        _query() {
            if (this.mode == IrSensorMode.RemoteControl)
                return mapButton(this.getNumber(NumberFormat.UInt8LE, this.channel))
            return 0
        }

        _update(prev: number, curr: number) {
            for (let i = 0; i < this.buttons.length; ++i) {
                let v = !!(curr & (1 << i))
                this.buttons[i].update(v)
            }
        }

        _deviceType() {
            return LMS.DEVICE_TYPE_IR
        }

        setRemoteChannel(c: IrRemoteChannel) {
            c = Math.clamp(0, 3, c | 0)
            this.channel = c
            this.setMode(IrSensorMode.RemoteControl)
        }

        setMode(m: IrSensorMode) {
            this._setMode(m)
        }

        getDistance() {
            this.setMode(IrSensorMode.Proximity)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        getRemoteCommand() {
            this.setMode(IrSensorMode.RemoteControl)
            return this.getNumber(NumberFormat.UInt8LE, this.channel)
        }

        getDirectionAndDistance() {
            this.setMode(IrSensorMode.Seek)
            return this.getNumber(NumberFormat.UInt16LE, this.channel * 2)
        }
    }


    //% whenUsed
    export const ir: IrSensor = new IrSensor()
}
