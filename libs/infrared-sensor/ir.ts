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
            case 1: return InfraredRemoteButton.TopLeft;
            case 2: return InfraredRemoteButton.BottomLeft;
            case 3: return InfraredRemoteButton.TopRight;
            case 4: return InfraredRemoteButton.BottomRight;
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

    const __remoteButtons: RemoteInfraredBeaconButton[] = [];
    function __irButton(id: InfraredRemoteButton): RemoteInfraredBeaconButton {
        for (let i = 0; i < __remoteButtons.length; ++i) {
            if (__remoteButtons[i].position == id)
                return __remoteButtons[i];
        }
        const btn = new RemoteInfraredBeaconButton(id, new brick.Button());
        __remoteButtons.push(btn);
        return btn;
    }

    //% fixedInstances
    export class RemoteInfraredBeaconButton extends control.Component {
        position: InfraredRemoteButton;
        private _button: brick.Button;
        constructor(position: InfraredRemoteButton, button: brick.Button) {
            super();
            this.position = position;
            this._button = button;
        }

        _update(curr: boolean) {
            this._button._update(curr);
        }

        /**
         * Check if a remote button is currently pressed or not.
         * @param button the remote button to query the request
         */
        //% help=sensors/beacon/is-pressed
        //% block="**remote button** %button|is pressed"
        //% blockId=remoteButtonIsPressed
        //% parts="remote"
        //% blockNamespace=sensors
        //% weight=81 blockGap=8
        //% group="Remote Infrared Beacon"
        isPressed() {
            return this._button.isPressed();
        }

        /**
         * See if the remote button was pressed again since the last time you checked.
         * @param button the remote button to query the request
         */
        //% help=sensors/beacon/was-pressed
        //% block="**remote button** %button|was pressed"
        //% blockId=remotebuttonWasPressed
        //% parts="remote"
        //% blockNamespace=sensors
        //% weight=80
        //% group="Remote Infrared Beacon"
        wasPressed() {
            return this._button.wasPressed();
        }

        /**
         * Do something when a remote button is pressed, bumped, or released
         * @param button the button that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        //% help=sensors/beacon/on-event
        //% blockId=remotebuttonEvent block="on **remote button** %button|%event"
        //% parts="remote"
        //% blockNamespace=sensors
        //% weight=99 blockGap=8
        //% group="Remote Infrared Beacon"
        onEvent(ev: ButtonEvent, body: () => void) {
            this._button.onEvent(ev, body);
        }

        /**
         * Pause until a remote button event happens
         * @param ev the event to wait for
         */
        //% help=sensors/beacon/pause-until
        //% blockId=remoteButtonPauseUntil block="pause until **remote button** %button|%event"
        //% parts="remote"
        //% blockNamespace=sensors
        //% weight=99 blockGap=8
        //% group="Remote Infrared Beacon"
        pauseUntil(ev: ButtonEvent) {
            this._button.pauseUntil(ev);
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

        _info(): string {
            if (this.mode == InfraredSensorMode.RemoteControl)
                return "remote";
            else if (this.mode == InfraredSensorMode.Proximity)
                return `${this._query()}%`;
            return "";
        }

        _update(prev: number, curr: number) {
            if (this.mode == InfraredSensorMode.RemoteControl) {
                for (let i = 0; i < __remoteButtons.length; ++i) {
                    const v = !!(curr & __remoteButtons[i].position);
                    __remoteButtons[i]._update(v)
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
         * Register code to run when an object is getting near.
         * @param handler the code to run when detected
         */
        //% help=sensors/infrared/on-event
        //% block="on **infrared** %this|%event"
        //% blockId=infraredOn
        //% parts="infraredsensor"
        //% blockNamespace=sensors
        //% weight=100 blockGap=8
        //% group="Infrared Sensor"
        //% this.fieldEditor="ports"
        onEvent(event: InfraredSensorEvent, handler: () => void) {
            this._setMode(InfraredSensorMode.Proximity)
            control.onEvent(this._id, event, handler);
        }

        /**
         * Wait until the infrared sensor detects something
         */
        //% help=sensors/infrared/pause-until
        //% block="pause until **infrared** %this| %event"
        //% blockId=infraredwait
        //% parts="infraredsensor"
        //% blockNamespace=sensors
        //% weight=99 blockGap=8
        //% group="Infrared Sensor"
        //% this.fieldEditor="ports"
        pauseUntil(event: InfraredSensorEvent) {
            this._setMode(InfraredSensorMode.Proximity)
            control.waitForEvent(this._id, event);
        }

        /**
         * Get the promixity measured by the infrared sensor, from ``0`` (close) to ``100`` (far)
         * @param sensor the infrared sensor
         */
        //% help=sensors/infrared/proximity
        //% block="**infrared** %this|proximity"
        //% blockId=infraredGetProximity
        //% parts="infrared"
        //% blockNamespace=sensors
        //% weight=98 blockGap=8
        //% group="Infrared Sensor"
        //% this.fieldEditor="ports"
        proximity(): number {
            this._setMode(InfraredSensorMode.Proximity)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        /**
         * Set the remote channel to listen to
         * @param channel the channel to listen
         */
        //% blockNamespace=sensors
        //% blockId=irSetRemoteChannel block="set **infrared** %this|remote channel to %channel"
        //% weight=99
        //% group="Remote Infrared Beacon"
        //% this.fieldEditor="ports"
        //% help=sensors/beacon/set-remote-channel
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
        //% blockId=irSetThreshold block="set **infrared** %this|%condition|to %value"
        //% group="Threshold" blockGap=8 weight=49
        //% value.min=0 value.max=100
        //% this.fieldEditor="ports"
        setPromixityThreshold(condition: InfraredSensorEvent, value: number) {
            if (condition == InfraredSensorEvent.ObjectNear)
                this._proximityThreshold.setLowThreshold(value)
            else
                this._proximityThreshold.setHighThreshold(value);
        }

        /**
         * Get a threshold value
         * @param condition the proximity condition
         */
        //% blockId=irGetThreshold block="**infrared** %this|%condition"
        //% group="Threshold" blockGap=8 weight=49
        //% this.fieldEditor="ports"
        proximityThreshold(condition: InfraredSensorEvent): number {
            return this._proximityThreshold.threshold(<ThresholdState><number>LightCondition.Dark);
        }

        // TODO
        private getDirectionAndDistance() {
            this._setMode(InfraredSensorMode.Seek)
            return this.getNumber(NumberFormat.UInt16LE, this._channel * 2)
        }
    }

    //% fixedInstance whenUsed block="1" jres=icons.port1
    export const infrared1: InfraredSensor = new InfraredSensor(1)

    //% fixedInstance whenUsed block="2" jres=icons.port2
    export const infrared2: InfraredSensor = new InfraredSensor(2)

    //% fixedInstance whenUsed block="3" jres=icons.port3
    export const infrared3: InfraredSensor = new InfraredSensor(3)

    //% fixedInstance whenUsed block="4" jres=icons.port4
    export const infrared4: InfraredSensor = new InfraredSensor(4)

    /**
     * Remote beacon (center) button.
     */
    //% whenUsed block="center" weight=95 fixedInstance
    export const remoteButtonCenter = __irButton(InfraredRemoteButton.CenterBeacon)

    /**
     * Remote top-left button.
     */
    //% whenUsed block="top left" weight=95 fixedInstance
    export const remoteButtonTopLeft = __irButton(InfraredRemoteButton.TopLeft)

    /**
     * Remote top-right button.
     */
    //% whenUsed block="top right" weight=95 fixedInstance
    export const remoteButtonTopRight = __irButton(InfraredRemoteButton.TopRight)

    /**
     * Remote bottom-left button.
     */
    //% whenUsed block="bottom left" weight=95 fixedInstance
    export const remoteButtonBottomLeft = __irButton(InfraredRemoteButton.BottomLeft)

    /**
     * Remote bottom-right button.
     */
    //% whenUsed block="bottom right" weight=95 fixedInstance
    export const remoteButtonBottomRight = __irButton(InfraredRemoteButton.BottomRight)
}
