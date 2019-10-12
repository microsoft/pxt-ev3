# Try

## Introduction @unplugged

Get a quick introduction to programming with EV3.

![Display on EV3 Brick with Music Notes](/static/getting-started/01_EyesOn_Intro.png)

We are excited to help you get started with @boardname@. In this project we will guide you through connecting your EV3 Brick, creating your first program, controlling a Large Motor, a Touch Sensor and a Color Sensor. These steps can take up to 45 minutes.

## Turn on your EV3 Brick @unplugged

Power on your EV3 Brick by pressing the Center Button.

![Hand pressing power button](/static/getting-started/02_PowerOn.png)

## Connect Your EV3 Brick to Your Device @unplugged

Use the USB cable to connect your EV3 Brick to your device.

![Computer and cable connected to EV3 Brick](/static/getting-started/03_insert-usb-02.png)

## Handle a button press @fullscreen

Drag out a ``||brick:on button||`` block from Buttons section in the ``||brick:Brick||`` Toolbox drawer.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
})
```

## Change of mood @fullscreen

Drag a Brick Screen ``||brick:show mood||`` block inside the ``||brick:on button||`` block.
Change mood to ``neutral``.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showMood(moods.neutral)
})
```

## Simulate @fullscreen

**Try out your code in the simulator!**

Click the center button on the EV3 Brick in the web page. It should display the mood you selected on the screen. Don't hesitate to use the simulator to try out your code during this tutorial!

![EV3 Brick simulator](/static/getting-started/simulate.png)

## Play some tunes @fullscreen

Drag a Music ``||music:play sound effect||`` block below the ``||brick:show mood||`` block.
Change sound effect to ``communication hello``.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showMood(moods.neutral)
    music.playSoundEffect(sounds.communicationHello)
})
```

## Download to your brick @unplugged

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### Did It Work?

Verify that the program you just created shows eyes on the Brick Display, and that the EV3 Brick played the sound “Hello!”

![EV3 Brick with eyes on the display](/static/getting-started/05_EyesOn.png)


**Well done!**

## Run it Again

![EV3 Brick with Try in BrkProg_Save Folder in File Manager](/static/getting-started/try-in-file-manager.png)

Use the Brick Buttons and navigate to the File Manager tab.  Open the **BrkProg_SAVE** folder, select **Try** and click the center button to run it again.

## Connect a Large Motor @unplugged

Now you will learn to control the Large Motor.

![EV3 Brick with hands connecting Large Motor to Port D](/static/getting-started/06_PlugInLargeMotor.png)

Connect a Large Motor to **Port D** of your EV3 Brick using any of the connector cables.

## Run a motor @fullscreen

Drag a ``||motors:run large A motor||`` block inside the ``||brick:on button||`` block.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
```

## Tune your motor @fullscreen

Change ``large motor A`` to ``large motor D``.
Click on the **(+)** sign and change to ``1`` rotation.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

## Download @unplugged

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### Did It Rotate?

Confirm that your motor has turned one rotation at power level 50 before stopping.

Download and run the program as many times as you want in order to verify this, or tinker with different power levels and different rotations.

![Large Motor D w/Rotating “WHRRR,” Hand, EV3 Brick](/static/getting-started/08_WorkingLargeMotor.png)

## Connect a Touch Sensor @unplugged

We will now control the Large Motor using a Touch Sensor.

Keeping the Large Motor connected to **Port D**, connect a Touch Sensor to **Port 1** of your EV3 Brick.

![Hands connecting Touch Sensor to Port 1 on EV3 Brick](/static/getting-started/09_Connect_Touch.png)

## Modify Your Program @fullscreen

* Add a ``||sensors:pause until touch 1 pressed||`` Sensor block on top of the ``||motors:run large motor D||`` block.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

## Download @unplugged

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### Press the Touch Sensor

Confirm that the Large Motor has turned one rotation AFTER you press the Touch Sensor.

Download and run the program as many times as you want in order to verify this, or tinker with different Touch Sensor and Large Motor values.

![Hand Touch Sensor Pressed & EV3 Brick & Large Motor](/static/getting-started/11_TouchMotorWorking.png)

## Connect a Color Sensor @unplugged

Now we will try to control the Large Motor using another sensor.

![Hand connecting Color Sensor to Port 4, Large Motor D, EV3 Brick](/static/getting-started/12_ConnectColor.png)

Keeping the Large Motor connected to **Port D**, connect the Color Sensor to **Port 4**.

## Update your code @fullscreen

Using the same program, replace the ``||sensors:pause until touch 1||`` block with a ``||sensors:pause color sensor 3||`` for color block.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Green)
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

Don't forget to select the color you want to detect (e.g., green)!

## Download @unplugged

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### Place a Colored Brick in Front of the Color Sensor

Confirm that the Large Motor has turned one rotation AFTER the Color Sensor has detected the colored brick.

Download and run the program as many times as you want in order to verify this, or tinker with different Color Sensor and Large Motor values.

![IMG: Colored bricks in front of Color Sensor, hands, EV3 Brick](/static/getting-started/14_ColorSensorWorking.png)

## JavaScript @fullscreen

Click on the **JavaScript** tab and change the color the Color Sensor detects to Black, Blue, Green, Yellow, Red, White, or Brown. Use Title Case for the color names.

```typescript
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Blue)
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

## Well Done! @unplugged

You have now learned how to control some of the inputs and outputs of the EV3.
