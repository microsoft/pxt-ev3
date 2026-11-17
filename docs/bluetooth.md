# Bluetooth Download

This guide explains how to pair your LEGO MINDSTORMS EV3 brick and download programs wirelessly over Bluetooth using Web Serial in BrickCode.

## Supported Browsers

Bluetooth download uses the **Web Serial API**, which is built into modern Chromium-based browsers:

* **Google Chrome** (version 89 or higher) — Windows, macOS, ChromeOS
* **Microsoft Edge** (version 89 or higher) — Windows, macOS
* **Opera**, **Brave**, and other Chromium-based browsers

#### ~ hint
Web Serial is enabled by default in all modern Chromium browsers. No flags or configuration changes in `chrome://flags` are needed!
#### ~

## Step 1: Turn on and pair your EV3

Before downloading over Bluetooth, your computer and EV3 brick must be paired:

1. On your EV3 brick, navigate to the **Settings** tab (the wrench icon 🔧).
2. Select **Bluetooth**, press the **Enter** (center) button, and ensure:
   * **Bluetooth** is checked (enabled).
   * **Visibility** is checked (enabled).
3. On your computer, open Bluetooth settings:
   * **Windows 11 / 10:** Go to **Settings > Bluetooth & devices > Add device > Bluetooth**.
   * **macOS:** Go to **System Settings > Bluetooth**.
4. Select your EV3 brick from the list (default name is usually **EV3**).
5. When the EV3 screen displays **Connect?**, select the checkmark (`✓`) with the center button.
6. When prompted, enter the passkey (default is **1234**) on the EV3 brick and confirm it on your computer to finish pairing.

## Step 2: Download your program in BrickCode

1. In BrickCode, click the **Download** button.
2. If prompted, select **Bluetooth** (or click the **'...'** button next to Download and select **Upload Method > Bluetooth**).
3. When the browser prompts you to select a serial port:
   * Select the serial port matching your EV3 brick.
   * Click **Connect**.
4. The program compiles and transfers wirelessly to the brick, launching automatically once the upload finishes.

## Choosing the correct serial port

When the browser port picker appears, select the outgoing Bluetooth serial port assigned to your EV3:

### Windows
* If your EV3 name is shown (e.g., `EV3 - Serial Port`), select it.
* If your EV3 name is not shown and multiple `Standard Serial over Bluetooth` ports appear, select the **Outgoing** port assigned to your EV3.
* **How to find your Outgoing COM port:**
  1. Open Windows **Settings**.
  2. Navigate to **Bluetooth & devices > Devices > More Bluetooth settings**.
  3. Switch to the **COM Ports** tab.
  4. Look for the row with Direction **Outgoing** assigned to your EV3 name. That COM port number (e.g., `COM3` or `COM7`) is the one to select in your browser!

### macOS
* In the browser port picker, select the port matching `cu.BRICKNAME-SerialPort` (for example, `/dev/cu.EV3-SerialPort`).

## Download speed and performance

* **Wireless transfer speed:** Around **30–40 KB/s**.
* A typical 100 KB program takes approximately **2.5–3.5 seconds** to download.
* While Bluetooth is slower than the direct USB cable connection (~130–230 KB/s), it offers full wireless convenience for testing robots on the field without plugging and unplugging cables.

## Troubleshooting

### EV3 is not responding or connection failed
* **Close conflicting applications:** Only one application can access the Bluetooth serial port at a time. Make sure official LEGO software (**EV3 Lab**, **EV3 Classroom**) and any other open **BrickCode tabs** are completely closed.
* **Exit on-brick apps:** If built-in apps such as **Port View** or **Motor Control** are open on the EV3 screen, press the **Back** button on the brick to return to the main menu before downloading.
* **Check on-brick pop-ups:** Make sure no dialog boxes or alert pop-ups are open on the EV3 brick screen, as they will prevent the downloaded app from launching.

### Could not open Bluetooth connection / Port open failed
* **Check pairing status:** On your EV3 brick, go to **Settings > Bluetooth > Connections**.
  * Make sure your computer is listed in the connections.
  * If the computer is not listed, or if the EV3 asks **Connect?**, the pairing was lost. Remove the EV3 in your computer's Bluetooth settings and pair it again.
* **Reset radio channel:** Turn Bluetooth off and on again in the EV3 brick settings, or toggle Bluetooth in your computer's settings to reset the radio channel, then click **Retry**.
* **Verify COM port:** On Windows, double-check that you selected the **Outgoing** port, not the incoming port or a port from another robot.

### Custom folder upload
* In BrickCode, you can specify a custom destination folder on the EV3 brick under **Project Settings**. Both USB and Bluetooth uploads will automatically use this destination directory.
