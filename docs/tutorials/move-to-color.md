# Move To Color

## Introduction @fullscreen

This tutorial shows how to move the EV3 driving base until the color sensor detects a color.

Here are the building instructions for the robot:

* [EV3 driving base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)
* [Color sensor down](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-color-sensor-down-driving-base-d30ed30610c3d6647d56e17bc64cf6e2.pdf)


## Step 1 Run code on button pressed

Drag ``||brick:on button pressed||`` block so that your code starts when the enter button is pressed (and not at the start). We are also using the ``||brick:show string||``
message easily diagnose if the program does not work.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showString("started", 1)
})
```

## Step 2 Turn on the motors

Drag a ``||motors:steer motors B+C||`` block under the button pressed event. This will turn on both motors.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showString("started", 1)
    motors.largeBC.steer(0, 50)
})
```

## Step 3 Pause until color

Drag a ``||sensors:pause until color detected||`` block after the steer and select the color you want to detect. This block will stop the program until the color is detected.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showString("started", 1)
    motors.largeBC.steer(0, 50)
    brick.showString("looking for red", 1)
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
})
```

### Step 4 Stop the motors!

Once the color is detected, the program will continue to run blocks. Drag a ``||motors:stop B+C motor||`` so that both motors stop.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    brick.showString("started", 1)
    motors.largeBC.steer(0, 50)
    brick.showString("looking for red", 1)
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
    brick.showString("stop", 1)
    motors.largeBC.stop()
})
```

## Step 5

Download your program to your brick and try it out!