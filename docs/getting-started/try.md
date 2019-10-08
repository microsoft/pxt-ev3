# Try

Get a quick introduction to programming with EV3.

![Display on EV3 Brick with Music Notes](/static/getting-started/01_EyesOn_Intro.png)

We are excited to help you get started with @boardname@. In this project we will guide you through connecting your EV3 Brick, creating your first program, controlling a Large Motor, a Touch Sensor and a Color Sensor. These steps can take up to 45 minutes.

## Turn on your EV3 Brick

Power on your EV3 Brick by pressing the Center Button.

![Hand pressing power button](/static/getting-started/02_PowerOn.png)

## Connect Your EV3 Brick to Your Device

Use the USB cable to connect your EV3 Brick to your device.

![Computer and cable connected to EV3 Brick](/static/getting-started/03_insert-usb-02.png)

## Create and Run your First Program

**Code it:** Create the program shown here.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showMood(moods.neutral)
    music.playSoundEffect(sounds.communicationHello)
})
```

* Drag out a ``||brick:on button||`` block from Buttons section in the ``||brick:Brick||`` Toolbox drawer.
* Drag a Brick Screen ``||brick:show mood||`` block inside the ``||brick:on button||`` block.
* Change mood to ``neutral``.

```block
brick.showMood(moods.neutral)
```

* Drag a Music ``||music:play sound effect||`` block below the ``||brick:show mood||`` block.
* Change sound effect to ``communication hello``.

```block
music.playSoundEffect(sounds.communicationHello)
```

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Did It Work?

![EV3 Brick with eyes on the display](/static/getting-started/05_EyesOn.png)

Verify that the program you just created shows eyes on the Brick Display, and that the EV3 Brick played the sound “Hello!”

**Well done!**

## Run it Again

![EV3 Brick with Try in BrkProg_Save Folder in File Manager](/static/getting-started/try-in-file-manager.png)

Use the Brick Buttons and navigate to the File Manager tab.  Open the **BrkProg_SAVE** folder, select **Try** and click the center button to run it again.

## Connect a Large Motor

Now you will learn to control the Large Motor.

![EV3 Brick with hands connecting Large Motor to Port D](/static/getting-started/06_PlugInLargeMotor.png)

Connect a Large Motor to **Port D** of your EV3 Brick using any of the connector cables.

## Create and Run This Program

**Code it:** Create the program shown here.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

* Start a new program.
* Drag a ``||motors:run large A motor||`` block inside the ``||brick:on button||`` block.
* Change ``large motor A`` to ``large motor D``.
* Click on the **(+)** sign.
* Change to ``1`` rotation.

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Did It Rotate?

Confirm that your motor has turned one rotation at power level 50 before stopping.

![Large Motor D w/Rotating “WHRRR,” Hand, EV3 Brick](/static/getting-started/08_WorkingLargeMotor.png)

Download and run the program as many times as you want in order to verify this, or tinker with different power levels and different rotations.

## Connect a Touch Sensor

We will now control the Large Motor using a Touch Sensor.

![Hands connecting Touch Sensor to Port 1 on EV3 Brick](/static/getting-started/09_Connect_Touch.png)

Keeping the Large Motor connected to **Port D**, connect a Touch Sensor to **Port 1** of your EV3 Brick.

## Modify Your Program

**Code it:** Add code to the program for the Touch Sensor.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

* Add a ``||sensors:pause until touch 1 pressed||`` Sensor block on top of the ``||motors:run large motor D||`` block.

```block
sensors.touch1.pauseUntil(ButtonEvent.Pressed)
```

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Press the Touch Sensor

Confirm that the Large Motor has turned one rotation AFTER you press the Touch Sensor.

![Hand Touch Sensor Pressed & EV3 Brick & Large Motor](/static/getting-started/11_TouchMotorWorking.png)

Download and run the program as many times as you want in order to verify this, or tinker with different Touch Sensor and Large Motor values.

## Connect a Color Sensor

Now we will try to control the Large Motor using another sensor.

![Hand connecting Color Sensor to Port 4, Large Motor D, EV3 Brick](/static/getting-started/12_ConnectColor.png)

Keeping the Large Motor connected to **Port D**, connect the Color Sensor to **Port 4**.

**Code it:** Modify Your Program to use the Color Sensor.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.color4.pauseUntilColorDetected(ColorSensorColor.Green)
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

* Using the same program, replace the ``||sensors:pause until touch 1||`` block with a ``||sensors:pause color sensor 4||`` for color block.

```block
sensors.color4.pauseUntilColorDetected(ColorSensorColor.Green)
```

* Select the color you want to detect (e.g., green).

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Place a Colored Brick in Front of the Color Sensor

![IMG: Colored bricks in front of Color Sensor, hands, EV3 Brick](/static/getting-started/14_ColorSensorWorking.png)

Confirm that the Large Motor has turned one rotation AFTER the Color Sensor has detected the colored brick.

Download and run the program as many times as you want in order to verify this, or tinker with different Color Sensor and Large Motor values.

Click on the **JavaScript** tab and change the color the Color Sensor detects to Black, Blue, Green, Yellow, Red, White, or Brown. Use Title Case for the color names.

## Well Done!

You have now learned how to control some of the inputs and outputs of the EV3.
