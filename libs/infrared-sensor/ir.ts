const enum InfraredSensorMode {
    None = -1,
    Proximity = 0,
    Seek = 1,
    RemoteControl = 2,
}

const enum InfraredRemoteChannel {
    //% block="channel 0"
    Ch0 = 0, // top
    //% block="channel 1"
    Ch1 = 1,
    //% block="channel 2"
    Ch2 = 2,
    //% block="channel 3"
    Ch3 = 3,
}

const enum InfraredRemoteButton {
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

const enum InfraredSensorEvent {
    //% block="object near"
    ObjectNear = 3,
    //% block="object detected"
    ObjectDetected = 2
}

namespace sensors {
    function mapButton(v: number) {
        switch (v) {
            case 1: return InfraredRemoteButton.TopLeft
            case 2: return InfraredRemoteButton.BottomLeft
            case 3: return InfraredRemoteButton.TopRight
            case 4: return InfraredRemoteButton.TopRight | InfraredRemoteButton.BottomRight
            case 5: return InfraredRemoteButton.TopLeft | InfraredRemoteButton.TopRight
            case 6: return InfraredRemoteButton.TopLeft | InfraredRemoteButton.BottomRight
            case 7: return InfraredRemoteButton.BottomLeft | InfraredRemoteButton.TopRight
            case 8: return InfraredRemoteButton.BottomLeft | InfraredRemoteButton.BottomRight
            case 9: return InfraredRemoteButton.CenterBeacon
            case 10: return InfraredRemoteButton.BottomLeft | InfraredRemoteButton.TopLeft
            case 11: return InfraredRemoteButton.TopRight | InfraredRemoteButton.BottomRight
            default: return 0;
        }
    }

    let buttons: RemoteInfraredBeaconButton[]

    export function irButton(id: InfraredRemoteButton): RemoteInfraredBeaconButton {
        if (buttons == null) {
            buttons = []
            for (let i = 0; i < 5; ++i) {
                buttons.push(new RemoteInfraredBeaconButton(new brick.Button()))
            }
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
    export class RemoteInfraredBeaconButton extends control.Component {
        private button: brick.Button;
        constructor(button: brick.Button) {
            super();
            this.button = button;
        }

        _update(curr: boolean) {
            this.button._update(curr);
        }

        /**
         * Check if a remote button is currently pressed or not.
         * @param button the remote button to query the request
         */
        //% help=input/remote-infrared-beacon/is-pressed
        //% block="%button|is pressed"
        //% blockId=remoteButtonIsPressed
        //% parts="remote"
        //% blockNamespace=sensors
        //% weight=81 blockGap=8
        //% group="Remote Infrared Beacon"
        isPressed() {
            return this.button.isPressed();
        }

        /**
         * See if the remote button was pressed again since the last time you checked.
         * @param button the remote button to query the request
         */
        //% help=input/remote-infrared-beacon/was-pressed
        //% block="%button|was pressed"
        //% blockId=remotebuttonWasPressed
        //% parts="remote"
        //% blockNamespace=sensors
        //% weight=80
        //% group="Remote Infrared Beacon"
        wasPressed() {
            return this.button.wasPressed();
        }

        /**
         * Do something when a button or sensor is clicked, up or down
         * @param button the button that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        //% help=input/remote-infrared-beacon/on-event
        //% blockId=remotebuttonEvent block="on %button|%event"
        //% parts="remote"
        //% blockNamespace=sensors
        //% weight=99 blockGap=8
        //% group="Remote Infrared Beacon"
        onEvent(ev: ButtonEvent, body: () => void) {
            this.button.onEvent(ev, body);
        }
    }

    //% fixedInstances
    export class InfraredSensor extends internal.UartSensor {
        private _channel: InfraredRemoteChannel;
        private _proximityThreshold: sensors.ThresholdDetector;

        constructor(port: number) {
            super(port)
            this._channel = InfraredRemoteChannel.Ch0
            this._proximityThreshold = new sensors.ThresholdDetector(this._id, 0, 100, 10, 90);
            irButton(0); // ensure buttons
            this.setMode(InfraredSensorMode.Proximity);
        }

        _query() {
            if (this.mode == InfraredSensorMode.RemoteControl)
                return mapButton(this.getNumber(NumberFormat.UInt8LE, this._channel));
            else if (this.mode == InfraredSensorMode.Proximity) {
                return this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff;
            }
            return 0
        }

        _update(prev: number, curr: number) {
            if (this.mode == InfraredSensorMode.RemoteControl) {
                for (let i = 0; i < buttons.length; ++i) {
                    let v = !!(curr & (1 << i))
                    buttons[i]._update(v)
                }
            } else if (this.mode == InfraredSensorMode.Proximity) {
                this._proximityThreshold.setLevel(curr);
            }
        }

        _deviceType() {
            return DAL.DEVICE_TYPE_IR
        }

        setMode(m: InfraredSensorMode) {
            this._setMode(m)
        }

        /**
         * Registers code to run when an object is getting near.
         * @param handler the code to run when detected
         */
        //% help=input/infrared/on
        //% block="on %sensor|%event"
        //% blockId=infraredOn
        //% parts="infraredsensor"
        //% blockNamespace=sensors
        //% weight=100 blockGap=8
        //% group="Infrared Sensor"
        onEvent(event: InfraredSensorEvent, handler: () => void) {
            this._setMode(InfraredSensorMode.Proximity)
            control.onEvent(this._id, event, handler);
        }

        /**
         * Waits for the event to occur
         */
        //% help=input/ultrasonic/wait
        //% block="pause until %sensor| %event"
        //% blockId=infraredwait
        //% parts="infraredsensor"
        //% blockNamespace=sensors
        //% weight=99 blockGap=8
        //% group="Infrared Sensor"
        pauseUntil(event: InfraredSensorEvent) {
            this._setMode(InfraredSensorMode.Proximity)
            control.waitForEvent(this._id, event);
        }

        /**
         * Get the promixity measured by the infrared sensor, from ``0`` (close) to ``100`` (far)
         * @param sensor the infrared sensor
         */
        //% help=input/infrared/proximity
        //% block="%sensor|proximity"
        //% blockId=infraredGetProximity
        //% parts="infrared"
        //% blockNamespace=sensors
        //% weight=98 blockGap=8   
        //% group="Infrared Sensor"     
        proximity(): number {
            this._setMode(InfraredSensorMode.Proximity)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        /**
         * Sets the remote channel to listen from
         * @param channel the channel to listen
         */
        //% blockNamespace=sensors
        //% blockId=irSetRemoteChannel block="set %sensor|remote channel to %channel"
        //% weight=65       
        //% group="Remote Infrared Beacon"
        setRemoteChannel(channel: InfraredRemoteChannel) {
            this.setMode(InfraredSensorMode.RemoteControl)
            channel = Math.clamp(0, 3, channel | 0)
            this._channel = channel;
        }

        /**
         * Sets a threshold value
         * @param condition the dark or bright light condition
         * @param value the value threshold
         */
        //% blockId=irSetThreshold block="set %sensor|%condition|to %value"
        //% group="Threshold" blockGap=8 weight=49
        //% value.min=0 value.max=100
        setPromixityThreshold(condition: InfraredSensorEvent, value: number) {
            if (condition == InfraredSensorEvent.ObjectNear)
                this._proximityThreshold.setLowThreshold(value)
            else
                this._proximityThreshold.setHighThreshold(value);
        }

        /**
         * Gets the threshold value
         * @param condition the proximity condition
         */
        //% blockId=irGetThreshold block="%sensor|%condition"
        //% group="Threshold" blockGap=8 weight=49
        //% sensor.fieldEditor="ports"
        proximityThreshold(condition: InfraredSensorEvent): number {
            return this._proximityThreshold.threshold(<ThresholdState><number>LightCondition.Dark);
        }

        // TODO
        getDirectionAndDistance() {
            this._setMode(InfraredSensorMode.Seek)
            return this.getNumber(NumberFormat.UInt16LE, this._channel * 2)
        }
    }

    //% fixedInstance whenUsed block="infrared 1" jres=icons.port1
    export const infraredSensor1: InfraredSensor = new InfraredSensor(1)

    //% fixedInstance whenUsed block="infrared 2" jres=icons.port2
    export const infraredSensor2: InfraredSensor = new InfraredSensor(2)

    //% fixedInstance whenUsed block="infrared 3" jres=icons.port3
    export const infraredSensor3: InfraredSensor = new InfraredSensor(3)

    //% fixedInstance whenUsed block="infrared 4" jres=icons.port4
    export const infraredSensor4: InfraredSensor = new InfraredSensor(4)

    /**
     * Remote beacon (center) button.
     */
    //% whenUsed block="remote button center" weight=95 fixedInstance
    export const remoteButtonCenter = irButton(InfraredRemoteButton.CenterBeacon)

    /**
     * Remote top-left button.
     */
    //% whenUsed block="remote button top-left" weight=95 fixedInstance
    export const remoteButtonTopLeft = irButton(InfraredRemoteButton.TopLeft)

    /**
     * Remote top-right button.
     */
    //% whenUsed block="remote button top-right" weight=95 fixedInstance
    export const remoteButtonTopRight = irButton(InfraredRemoteButton.TopRight)

    /**
     * Remote bottom-left button.
     */
    //% whenUsed block="remote button bottom-left" weight=95 fixedInstance
    export const remoteButtonBottomLeft = irButton(InfraredRemoteButton.BottomLeft)

    /**
     * Remote bottom-right button.
     */
    //% whenUsed block="remote button bottom-right" weight=95 fixedInstance
    export const remoteButtonBottomRight = irButton(InfraredRemoteButton.BottomRight)
}
