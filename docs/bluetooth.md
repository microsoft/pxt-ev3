# Bluetooth

This page describes the procedure to download MakeCode program to the EV3 brick 
over Bluetooth.

## ~ hint

### WARNING: EXPERIMENTAL FEATURES AHEAD! 

Support for Bluetooth download relies on [Web Serial](https://wicg.github.io/serial/),
an experimental browser feature. Web Serial is a work [in progress](https://www.chromestatus.com/feature/6577673212002304); 
it may change or be removed in future versions without notice.

By enabling these experimental browser features, you could lose browser data or compromise your security 
or privacy.

## ~

## Supported browsers

* Chrome desktop, version 77 and higher, Windows 10
* [Edge Insider desktop](https://www.microsoftedgeinsider.com), version 77 and higher, Windows 10

To make sure your browser is up to date, go to the '...' menu, click "Help" then "About".

## Machine Setup

* pair your EV3 brick with your computer over Bluetooth. This is the usual pairing procedure.
* go to [chrome://flags/#enable-experimental-web-platform-features](chrome://flags/#enable-experimental-web-platform-features) and **enable** 
**Experimental Web Platform features**

## Download over Bluetooth

* go to the **beta** editor https://makecode.mindstorms.com/beta
* click on **Download** to start a file download as usual
* on the download dialog, you should see a **Bluetooth** button. Click on the
**Bluetooth** button to enable the mode.
* **make sure the EV3 brick is not running a program**
* click on **Download** again to download over bluetooth.

## Choosing the correct serial port

Unforunately, the browser dialog does not make it easy to select which serial port is the brick.
On Windows, it typically reads "Standard Serial over Bluetooth" and you may 
have multiple of those if you've paired different bricks.

## Feedback

Please send us your feedback through https://forum.makecode.com.