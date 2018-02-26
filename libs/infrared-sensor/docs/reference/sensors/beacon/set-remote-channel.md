# set Remote Channel

Set the remote infrared signal channel for an infrared sensor.

```sig
sensors.infrared1.setRemoteChannel(InfraredRemoteChannel.Ch0)
```
An infrared sensor connected to the @boardname@ can receive messages (signals for button events) from a remote infrared beacon. In order for the sensor to know which beacon to receive messages from, a _channel_ is used. The beacon has a switch on it to select a particular channel to transmit on. The sensor needs to know which channel to receive ("listen" for) messages from the beacon.

A sensor is not automatically set to listen for infrared messages on a channel. To avoid confusion on which sensor receives signals from a beacon, each sensor (if you have more than one), sets a remote channel for itself. The channel number matches the channel selected on the beacon.

## Parameters

* **channel**: the channel for the infrared sensor to "listen" on. You can choose to use one of 4 channels: ``0``, ``1``, ``2``, and ``3``.

## Example

Select channel **2** on an infrared beacon. Set the remote channel for infrared sensor  ``infrared 3`` to channel ``2``. Wait for the ``center`` button press on the beacon using channel ``2``.

```blocks
sensors.infrared3.setRemoteChannel(InfraredRemoteChannel.Ch2);
sensors.remoteButtonCenter.pauseUntil(ButtonEvent.Pressed);
brick.clearScreen();
brick.showString("Center button on", 1);
brick.showString("channel 2 beacon", 2);
brick.showString("was pressed.", 3);
```

## See also

[was pressed](/reference/sensors/beacon/was-pressed), [on event](/reference/sensors/beacon/on-event)

[EV3 Infrared Beacon][lego beacon]

[lego beacon]: https://education.lego.com/en-us/products/ev3-infrared-beacon/45508