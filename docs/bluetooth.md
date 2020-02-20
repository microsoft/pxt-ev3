# Bluetooth

This page describes the procedure to download MakeCode program to the EV3 brick 
over Bluetooth.

## ~ hint

### WARNING: EXPERIMENTAL FEATURES AHEAD! 

Support for Bluetooth download relies on [Web Serial](https://wicg.github.io/serial/),
an experimental browser feature. Web Serial is a work [in progress](https://www.chromestatus.com/feature/6577673212002304); 
it may change or be removed in future versions without notice.

By enabling these experimental browser features, you could lose browser data or compromise your device security 
or privacy.

## ~

https://youtu.be/VIq8-6Egtqs

## Supported browsers

* Chrome desktop, version 77 and higher, Windows 10 or Mac OS.
* [Microsoft Edge Insider desktop](https://www.microsoftedgeinsider.com), version 77 and higher, Windows 10 or Mac OS.

To make sure your browser is up to date, go to the '...' menu, click "Help" then "About".

Next you need to enable the experimental features (this may change in the future)

* go to **chrome://flags/#enable-experimental-web-platform-features** and **enable** 
**Experimental Web Platform features**

![A screenshot of the flags page in chrome](/static/bluetooth/experimental.png)

## Machine Setup

* pair your EV3 brick with your computer over Bluetooth. This is the usual pairing procedure.

## Download over Bluetooth

* go to https://makecode.mindstorms.com/
* click on **Download** to start a file download as usual
* on the download dialog, you should see a **Bluetooth** button. Click on the
**Bluetooth** button to enable the mode.
* **make sure the EV3 brick is not running a program**
* click on **Download** again to download over bluetooth.

## Choosing the correct serial port

Unfortunately, the browser dialog does not make it easy to select which serial port is the brick.

* On Windows, choose ``Standard Serial over Bluetooth``. There might be multiple of those but only one works. Try your luck! Once you know the COM port number, remember it for the next time around.
* On Mac OS, choose ``cu.BRICKNAME-SerialPort``

## Known issues

* We do not detect properly that the program is running on the brick. Make sure to stop the program before starting the download procedure.
* The list of programs on the brick screen is not updated when uploading via bluetooth.

## Feedback

Please send us your feedback through https://forum.makecode.com.