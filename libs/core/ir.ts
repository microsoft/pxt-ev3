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

    let buttons: Button[]

    function create(ir: InfraredSensor) {
        // it's created by referencing it
    }

    export function irButton(id: IrRemoteButton) {
        if (buttons == null) {
            buttons = []
            for (let i = 0; i < 5; ++i) {
                buttons.push(new Button())
            }

            // make sure sensors are up
            create(infrared1)
            create(infrared2)
            create(infrared3)
            create(infrared4)
        }

        let num = -1
        while (id) {
            id >>= 1;
            num++;
        }
        num = Math.clamp(0, buttons.length - 1, num)
        return buttons[num]
    }

    //% fixedInstances
    export class InfraredSensor extends internal.UartSensor {
        private channel: IrRemoteChannel

        constructor(port: number) {
            super(port)
            this.channel = IrRemoteChannel.Ch0
            irButton(0) // make sure buttons array is initalized

            // and set the mode, as otherwise button events won't work
            this.mode = IrSensorMode.RemoteControl
        }

        _query() {
            if (this.mode == IrSensorMode.RemoteControl)
                return mapButton(this.getNumber(NumberFormat.UInt8LE, this.channel))
            return 0
        }

        _update(prev: number, curr: number) {
            for (let i = 0; i < buttons.length; ++i) {
                let v = !!(curr & (1 << i))
                buttons[i].update(v)
            }
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_IR
        }

        setRemoteChannel(c: IrRemoteChannel) {
            c = Math.clamp(0, 3, c | 0)
            this.channel = c
            this.setMode(IrSensorMode.RemoteControl)
        }

        setMode(m: IrSensorMode) {
            this._setMode(m)
        }

        /**
         * Get the promixity measured by the infrared sensor, from ``0`` (close) to ``100`` (far)
         * @param ir the infrared sensor
         */
        //% help=input/infrared/proximity
        //% block="%infrared|proximity"
        //% blockId=infraredGetProximity
        //% parts="infrared"
        //% blockNamespace=input
        //% weight=65 blockGap=8   
        //% group="Infrared Sensor"     
        proximity() {
            this.setMode(IrSensorMode.Proximity)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        /**
         * Get the remote commandreceived the infrared sensor.
         * @param ir the infrared sensor
         */
        //% help=input/infrared/remote-command
        //% block="%infrared|remote command"
        //% blockId=infraredGetRemoteCommand
        //% parts="infrared"
        //% blockNamespace=input
        //% weight=65 blockGap=8        
        //% group="Infrared Sensor"     
        remoteCommand() {
            this.setMode(IrSensorMode.RemoteControl)
            return this.getNumber(NumberFormat.UInt8LE, this.channel)
        }

        // TODO
        getDirectionAndDistance() {
            this.setMode(IrSensorMode.Seek)
            return this.getNumber(NumberFormat.UInt16LE, this.channel * 2)
        }
    }

    //% fixedInstance whenUsed
    export const infrared1: InfraredSensor = new InfraredSensor(1)

    //% fixedInstance whenUsed
    export const infrared2: InfraredSensor = new InfraredSensor(2)

    //% fixedInstance whenUsed
    export const infrared3: InfraredSensor = new InfraredSensor(3)

    //% fixedInstance whenUsed
    export const infrared4: InfraredSensor = new InfraredSensor(4)

    /**
     * Remote top-left button.
     */
    //% whenUsed block="remote top-left" weight=95 fixedInstance
    export const remoteTopLeft = irButton(IrRemoteButton.TopLeft)

    /**
     * Remote top-right button.
     */
    //% whenUsed block="remote top-right" weight=95 fixedInstance
    export const remoteTopRight = irButton(IrRemoteButton.TopRight)

    /**
     * Remote bottom-left button.
     */
    //% whenUsed block="remote bottom-left" weight=95 fixedInstance
    export const remoteBottomLeft = irButton(IrRemoteButton.BottomLeft)

    /**
     * Remote bottom-right button.
     */
    //% whenUsed block="remote bottom-right" weight=95 fixedInstance
    export const remoteBottomRight = irButton(IrRemoteButton.BottomRight)

    /**
     * Remote beacon (center) button.
     */
    //% whenUsed block="remote center" weight=95 fixedInstance
    export const remoteCenter = irButton(IrRemoteButton.CenterBeacon)
}
