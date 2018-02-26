# Try

[IMG: Neutral Image Display on EV3 Brick with Music Notes]

## Try 
Get a quick introduction to programming with EV3.

We are excited to help you get started with LEGO MINDSTORMS Education EV3. In this project we will guide you through connecting your EV3 brick, creating your first program, controlling a Large Motor, a Touch Sensor and a Color Sensor. These steps can take up to 45 minutes.

### Turn on your EV3 Brick

[IMG: Hand pressing power button, Neutral Image Display, EV3 Brick]

Power on your EV3 Brick by pressing the Center Button.

### Connect Your EV3 Brick to Your Device

[IMG: Hand on cable & computer, Neutral Image Display, EV3 Brick]

Use the USB cable to connect your EV3 Brick to your device.

### Create and Run your First Program

[IMG: Try Program Blocks (see JavaScript below)]

1 - Create the program shown here:

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showMood(moods.neutral)
    music.playSoundEffect(sounds.communicationHello)
})
```

* Drag a Brick Screen show mood block inside the on button block
* Change mood to 

```block
brick.showMood(moods.neutral)
```

* Drag a Music play sound effect block below the show mood block
* Change sound effect to 

```block
music.playSoundEffect(sounds.communicationHello)
```

2 – Click Download and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### ~ hint

Note: Click here  for help and more information about the programming blocks.

### ~

### Did It Work?

[IMG: Neutral Image Display, EV3 Brick]

Verify that the program you just created shows eyes on the Brick Display, and that the EV3 Brick played the sound “Hello!”

**Well done!**

### Connect a Large Motor

[IMG: EV3 Brick with hands connecting Large Motor to Port D]

Now you will learn to control the Large Motor.

Connect a Large Motor to Port D of your EV3 Brick using any of the connector cables.

### Create and Run This Program

[IMG: Program Blocks (see JavaScript below)]

1) Create the program shown here:

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

* Start a new program
* Drag a run large A motor block inside the on button block
* Change large A to large D motors.largeD.run(50)
* Click on the + sign
* Change to 1 rotation

2) Click Download and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### Did It Rotate?

[IMG: Large Motor D w/Rotating “WHRRR,” Hand, EV3 Brick]

Confirm that your motor has turned one rotation at power level 50 before stopping.

Download and run the program as many times as you want in order to verify this, or tinker with different power levels and different rotations.

### Connect a Touch Sensor

[IMG: Hands connecting Touch Sensor to Port 1 on EV3 Brick]

We will now control the Large Motor using a Touch Sensor.

Keeping the Large Motor connected to **Port D**, connect a Touch Sensor to **Port 1** of your EV3 Brick.

### Modify Your Program

[IMG: Program Blocks (see JavaScript below)]

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

1) Add a pause until touch 1 pressed Sensor block on top of the run large D Motor block

```block
sensors.touch1.pauseUntil(ButtonEvent.Pressed)
```

2) Click Download and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### Press the Touch Sensor

[IMG: Hand Touch Sensor Pressed & EV3 Brick & Large Motor]

Confirm that the Large Motor has turned one rotation AFTER you press the Touch Sensor.

Download and run the program as many times as you want in order to verify this, or tinker with different Touch Sensor and Large Motor values.

### Connect a Color Sensor

[IMG: Hand connecting Color Sensor to Port 4, Large Motor D, EV3 Brick]

Now we will try to control the Large Motor using another sensor.

Keeping the Large Motor connected to **Port D**, connect the Color Sensor to **Port 4**.
Modify Your Program

[IMG: Program Blocks (see JavaScript below)]

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    sensors.color3.pauseForColor(ColorSensorColor.Green)
    motors.largeD.run(50, 1, MoveUnit.Rotations)
})
```

1) Using the same program, replace the pause until touch 1 block with a pause color 3 for color block

```block
sensors.color3.pauseForColor(ColorSensorColor.Green)
```

2) Select the color you want to detect (e.g., green).

3) Click Download and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### Place a Colored Brick in Front of the Color Sensor

[IMG: Colored bricks in front of Color Sensor, hands, EV3 Brick]

Confirm that the Large Motor has turned one rotation AFTER the Color Sensor has detected the colored brick.

Download and run the program as many times as you want in order to verify this, or tinker with different Color Sensor and Large Motor values.

Click on the JavaScript tab and change the color the Color Sensor detects to Black, Blue, Green, Yellow, Red, White, or Brown. Use Title Case for the color names.

### Well Done!

[IMG: EV3 Driving Base]

You have now learned how to control some of the inputs and outputs of the EV3.

