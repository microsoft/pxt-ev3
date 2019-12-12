# Troubleshooting

## Download issues

If you're having trouble getting your code onto the EV3 Brick, try these steps to see if you can fix the problem.

### Check your **@drivename@** firmware

MakeCode needs a firmware version of **1.10E** or higher installed on your brick. 

#### ~hint

Firmware is the software that runs all the basic operations on your EV3 Brick. Your programs and the firmware work together to make the EV3 Brick do all things you want it to. Your EV3 Brick comes with firmware pre-installed, but it may need to be updated to work properly with MakeCode.

#### ~

To check the the firmware version on your EV3 Brick:

1. Go to the **Settings** menu (it's under the wrench tool symbol)
2. Select **Brick Info** and press ENTER

![Brick Info menu](/static/setup/brickinfo.jpg)

3. Check the version number under **Brick FW:**

![Brick Firmware version](/static/setup/brickfw.jpg)

If you can't find the **Brick Info** or you see that the version is less than **1.10E**, **you need to upgrade your firmware**.

### Upgrade your **@drivename@**

If your a firmware version level is less than **1.10E**, you need to install an upgraded version. You can upgrade the firmware with the **EV3 Lab** or **EV3 Programming** software. Also, you can do a manual upgrade by downloading the firmware install file. See the [Firmware Update](https://education.lego.com/en-us/support/mindstorms-ev3/firmware-update) support page to learn about the upgrade process.

#### ~ hint

**Recommended:** Upgrade with the **[EV3 Device Manager](https://ev3manager.education.lego.com/)**

#### ~

## Can I see the **@drivename@** drive on my computer?

When your EV3 Brick is connected to your computer, you should see a new drive called **@drivename@** attached.

On Windows, it looks like this in Explorer:

![@drivename@ Drive in Windows Explorer](/static/setup/ev3-drive-windows.png)

If you don't see the **@drivename@** drive, make sure your brick is powered on and check that your USB connection is good.

### The display on the EV3 Brick is blank

Make sure your EV3 Brick is charged and powered on. If your it doesn't turn on, find the charger and plug it into wall power, then connect it to your EV3 Brick. Does it turn on and start up?

### I still can't see my @drivename@ drive

Make sure that one end of your USB cable is firmly inserted into a USB port on the computer and the other end is connected to the EV3 Brick. If you still can't see the **@drivename@** drive, try a different port on the computer. If that doesn't work then maybe your cable is faulty or you need to reset the EV3 Brick.

## Why can't I delete my program (*.uf2) files from the Brick? #deletefiles

There's a bug in the firmware which prevents you from deleting the programs (``*.uf2`` files) from your EV3 Brick. There isn't a firmware update to fix this yet.

We have prepared a special program that lets you delete UF2 files from the brick.
Download [these PDF instructions](/file-manager.pdf) and drop the PDF on the brick drive.
This will present you with an menu for deleting files.

For other common questions, try the FAQ page https://makecode.mindstorms.com/faq.

## How do I reset my EV3 Brick?

If you think your USB connection is good and you still can't see your **@drivename@** drive, try giving the EV3 Brick a reset. You can follow these steps to reset:

1. Using a finger from one hand, press the **Back** button. Keep holding it.
2. With your other hand, use two fingers to hold down both the **Left** button and the **Center** button. You hold these at the same time while you're still pressing the **Back** button.
3. Now, release your finger from the **Back** button.
4. When the EV3 Brick says "Starting.." you can let go of the **Left** and **Enter** buttons.

You can also watch this [How to Reset](https://www.lego.com/en-us/videos/themes/mindstorms/how-to-reset-the-ev3-p-brick-fbcbdbed398e4e12a7ce30fa662c54be) video.

## LEGO Support

If you've checked everything here and can't get the **@drivename@** drive to show up on your computer, you can't make the EV3 Brick reset, or your program just won't download, then try the [Troubleshooting Walkthrough](https://www.lego.com/en-us/service/help/products/themes-sets/mindstorms/lego-mindstorms-ev3-troubleshooting-walkthrough-408100000009798).

You can also find more help at [LEGO Support](https://www.lego.com/en-us/mindstorms/support).