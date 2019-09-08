# Robot 1 Lesson

## Step 1 Build Your Driving Base Robot @unplugged

Build the robot driving base:

[![EV3 Driving Base](/static/lessons/common/ev3-driving-base.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)

If clicking the above image doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.


## Step 2 Show an image @fullscreen

It's useful to know that your program is running. Plug a ``||brick:show mood||`` from the **BRICK** toolbox
inside the ``||loops:on start||`` block. Change the image if you want!

```blocks
brick.showMood(moods.neutral)
```

## Step 3 Try your code @fullscreen

Look at the simulator and check that your image is showing up. When you are ready, press the **DOWNLOAD** button
and follow the instructions to transfer your code on the brick.

## Step 4 Steer motors @fullscreen

Drag a ``||motors:steer motors||`` block from the **MOTORS** toolbox and snap it under ``||brick:show mood||``.
Click on the plus and make sure to tell your motors to turn **1** rotation.

```blocks
brick.showMood(moods.neutral)
motors.largeBC.steer(0, 50, 1, MoveUnit.Rotations)
```

## Step 5 Try your code @fullscreen

Whenever you make a code change, the simulator will restart and you can preview what your code will do there.
When you are ready, click **DOWNLOAD** and follow the instructions to transfer the code into your brick.

**Remember** Take the driving base apart at the end of the session, so the other group can build it next time