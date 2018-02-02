const enum InfraredSensorMode {
    None = -1,
    Proximity = 0,
    Seek = 1,
    RemoteControl = 2,
}

const enum InfraredRemotechannel {    
    Ch0 = 0, // top
    Ch1 = 1,
    Ch2 = 2,
    Ch3 = 3,
}

const enum InfraredRemoteButton {
    //% block="remote center button"
    CenterBeacon = 0x01,
    //% block="remote top left button"
    TopLeft = 0x02,
    //% block="remote bottom left button"
    BottomLeft = 0x04,
    //% block="remote top right button"
    TopRight = 0x08,
    //% block="remote bottom right button"
    BottomRight = 0x10,
}

const enum InfraredSensorProximityEvent {
    //% block="object near"
    ObjectNear = 3,
    //% block="object detected"
    ObjectDetected = 2
}

namespace sensors {
    //% fixedInstances
    export class InfraredSensor extends internal.UartSensor {
        private _channel: InfraredRemotechannel;
        private _buttons: brick.Button[]
        private _proximityThreshold: sensors.ThresholdDetector;
        
        constructor(port: number) {
            super(port)
            this._channel = InfraredRemotechannel.Ch0
            this._proximityThreshold = new sensors.ThresholdDetector(this._id, 0, 100, 10, 90);
            this._buttons = [];
            for (let i = 0; i < 5; ++i) {
                this._buttons.push(new brick.Button())
            }
            // and set the mode, as otherwise button events won't work
            this.mode = InfraredSensorMode.RemoteControl;
        }

        private irButton(id: InfraredRemoteButton): brick.Button {
            let num = -1
            while (id) {
                id >>= 1;
                num++;
            }
            num = Math.clamp(0, this._buttons.length - 1, num)
            return this._buttons[num]
        }

        private mapButton(v: number) {
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

        _query() {
            if (this.mode == InfraredSensorMode.RemoteControl)
                return this.mapButton(this.getNumber(NumberFormat.UInt8LE, this._channel));
            else if (this.mode == InfraredSensorMode.Proximity) {
                return this.getNumber(NumberFormat.UInt16LE, 0) & 0x0fff;
            }
            return 0
        }

        _update(prev: number, curr: number) {
            if (this.mode == InfraredSensorMode.RemoteControl) {
                for (let i = 0; i < this._buttons.length; ++i) {
                    let v = !!(curr & (1 << i))
                    this._buttons[i]._update(v)
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
        //% help=input/infrared/onProximityEvent
        //% block="on %sensor|%event"
        //% blockId=infraredOn
        //% parts="infraredsensor"
        //% blockNamespace=sensors
        //% weight=100 blockGap=8
        //% group="Infrared Sensor"
        onPromxityEvent(event: InfraredSensorProximityEvent, handler: () => void) {
            this.setMode(InfraredSensorMode.Proximity)
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
        pauseUntilPromixity(event: InfraredSensorProximityEvent) {
            this.setMode(InfraredSensorMode.Proximity)
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
            this.setMode(InfraredSensorMode.Proximity)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        /**
         * Sets a threshold value
         * @param condition the dark or bright light condition
         * @param value the value threshold
         */
        //% blockId=irSetThreshold block="set %sensor|%condition|to %value"
        //% group="Threshold" blockGap=8 weight=49
        //% value.min=0 value.max=100
        setProximityThreshold(condition: InfraredSensorProximityEvent, value: number) {
            this.setMode(InfraredSensorMode.Proximity);
            if (condition == InfraredSensorProximityEvent.ObjectNear)
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
        proximityThreshold(condition: InfraredSensorProximityEvent): number {
            this.setMode(InfraredSensorMode.Proximity);
            return this._proximityThreshold.threshold(<ThresholdState><number>LightCondition.Dark);
        }       
                
        /**
         * Check if a remote button is currently pressed or not.
         * @param button the remote button to query the request
         */
        //% help=input/infrared-sensor/is-pressed
        //% block="%sensor|is %button|pressed"
        //% blockId=remoteButtonIsPressed
        //% parts="remote"
        //% blockNamespace=sensors
        //% weight=81 blockGap=8
        //% group="Remote Infrared Beacon"
        isRemoteButtonPressed(button: InfraredRemoteButton) {
            this.setMode(InfraredSensorMode.RemoteControl);
            const btn = this.irButton(button);
            return btn && btn.isPressed();
        }

        /**
         * See if the remote button was pressed again since the last time you checked.
         * @param button the remote button to query the request
         */
        //% help=input/infrared-sensor/was-pressed
        //% block="%sensor|was %button|pressed"
        //% blockId=remotebuttonWasPressed
        //% parts="remote"
        //% blockNamespace=sensors
        //% weight=80
        //% group="Remote Infrared Beacon"
        wasRemoteButtonPressed(button: InfraredRemoteButton) {
            this.setMode(InfraredSensorMode.RemoteControl);
            const btn = this.irButton(button);
            return btn && btn.wasPressed();
        }

        /**
         * Do something when a button or sensor is clicked, up or down
         * @param button the button that needs to be clicked or used
         * @param event the kind of button gesture that needs to be detected
         * @param body code to run when the event is raised
         */
        //% help=input/infrared-sensor/on-event
        //% blockId=remotebuttonEvent block="on %sensor|%button|%event"
        //% parts="remote"
        //% weight=99 blockGap=8
        //% group="Remote Infrared Beacon"
        onRemoteButtonEvent(button: InfraredRemoteButton, ev: ButtonEvent, body: () => void) {
            this.setMode(InfraredSensorMode.RemoteControl);
            const btn = this.irButton(button);
            if (btn) btn.onEvent(ev, body);
        }  
        
        /**
         * Sets the remote channel
         * @param channel 
         */
        //% blockId=irsetRemoteChannel block="set %sensor| remote channel to %channel"
        //% parts="remote"
        //% group="Remote Infrared Beacon"
        setRemoteChannel(channel: InfraredRemotechannel) {
            this.setMode(InfraredSensorMode.RemoteControl);
            channel = Math.clamp(0, 3, channel | 0)
            this._channel = channel
        } 

        private getDirectionAndDistance() {
            this.setMode(InfraredSensorMode.Seek);
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
}
