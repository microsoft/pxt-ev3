# Robot 1 Lesson

## Step 1 - Build Your Driving Base Robot @unplugged

Build the medium motor robot driving base:

* [Driving base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)
* [Medium motor driving base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-medium-motor-driving-base-e66e2fc0d917485ef1aa023e8358e7a7.pdf)

If clicking on the image above doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

## Step 2 - Show an image @fullscreen

At first, it's nice to know that your program is running. Plug in a ``||brick:show mood||`` from the **BRICK** toolbox drawer
into the ``||loops:on start||`` block. Change the image to something else if you want!

```blocks
brick.showMood(moods.sleeping)
```

## Step 3 - Try your code @fullscreen

Look at the simulator and check that your image is showing on the screen. When you are ready, press the **DOWNLOAD** button
and follow the instructions to transfer your code on the brick.

## Step 4 - Pause on Start @fullscreen

As you may have noticed, the code starts running immediately once you download it to the brick. To prevent the robot
from rolling away, add a ``||brick:pause until enter pressed||`` button to wait for the user to press enter.

```blocks
brick.showMood(moods.sleeping)
brick.buttonEnter.pauseUntil(ButtonEvent.Pressed)
```

## Step 5 - Steer motors @fullscreen

Drag a ``||motors:steer motors||`` block from the **MOTORS** toolbox drawer and snap it in under ``||brick:show mood||``.
Click on the **(+)** symbol and make sure to tell your motors to turn **1** rotation.

```blocks
brick.showMood(moods.sleeping)
brick.buttonEnter.pauseUntil(ButtonEvent.Pressed)
brick.showMood(moods.neutral)
motors.largeBC.steer(0, 50, 1, MoveUnit.Rotations)
```

## Step 6 - Try your code @fullscreen

Whenever you make a code change, the simulator will restart so you can see what your latest change will do.
When you are ready, click **DOWNLOAD** and follow the instructions to transfer the code into your brick.

**Remember**: Take the driving base apart at the end of the session so that another group can build their robot too.