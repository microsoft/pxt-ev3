# Using Touch Sensor Values

## Introduction @fullscreen

Use the Touch sensor value to stop a running motor.

![Touch sensor and motor attached to brick](/static/tutorials/touch-sensor-values/touch-to-stop.gif)

## Step 1

Open the ``||brick:Brick||`` Toolbox drawer. Drag an ``||brick:on button||`` block onto the Workspace, and place it anywhere on the Workspace.

```block
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
	
})
```

## Step 2

Open the ``||motors:Motors||`` Toolbox drawer. Drag out a ``||motors:run||`` block onto the Workspace, and drop it into the ``||brick:on button||`` block.

```block
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
	motors.largeA.run(50)
})
```

## Step 3

Open the ``||logic:Logic||`` Toolbox drawer. Drag out an ``||logic:if then||`` block onto the Workspace, and drop it into the ``||loops:forever||`` block.

```block
forever(function () {
    if (true) {

    }
})
```

## Step 4

Open the ``||sensors:Sensors||`` Toolbox drawer. Drag out a ``||sensors:touch is pressed||`` block onto the Workspace, and drop it in the ``||logic:if then||`` block replacing ``true``.

```block
forever(function () {
    if (sensors.touch1.isPressed()) {

    }
})
```

## Step 5

Open the ``||music:Music||`` Toolbox drawer.  Drag out a ``||music:play sound effect||`` block onto the Workspace, and drop it under the ``||logic:if then||`` block.

```block
forever(function () {
    if (sensors.touch1.isPressed()) {
        music.playSoundEffect(sounds.animalsCatPurr)
    }
})
```

## Step 6

In the ``||music:play sound effect||`` block, use the drop-down menu to select the ``information touch`` sound effect.

```block
forever(function () {
    if (sensors.touch1.isPressed()) {
        music.playSoundEffect(sounds.informationTouch)
    }
})
```

## Step 7

Open the ``||motors:Motors||`` Toolbox drawer. Drag out a ``||motors:stop||`` block onto the Workspace, and drop it in after the ``||music:play sound effect||`` block.

```block
forever(function () {
    if (sensors.touch1.isPressed()) {
        music.playSoundEffect(sounds.informationTouch)
        motors.largeA.stop()
    }
})
```

## Step 8

Now, let’s download our program to the brick. Plug your EV3 brick into the computer with the USB cable, and click the blue **Download** button in the bottom left of your screen. Follow the directions to save your program to the brick.  Attach a Large motor to Port A, and a Touch sensor to Port 1 on your brick. Test your program by pressing the ENTER button. When the motor starts, press the touch sensor. Does the motor stop as expected?
