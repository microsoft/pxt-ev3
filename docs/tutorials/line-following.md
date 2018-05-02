# Line Following

## Introduction @fullscreen

Make a program to follow a line using the Color sensor and reflected light. Let's test reflected light to see if it's white or black (on the line), and drive our robot accordingly. 

![Brick with color sensors tracking a yellow line](/static/tutorials/line-following/line-following.gif)

## Step 1

In the ``||logic:Logic||`` Toolbox drawer under the **Conditionals** section, drag out an ``||logic:If then else||`` block onto the Workspace, and drop it into the ``||loops:forever||`` loop.

```blocks
forever(function () {
    if (true) {

    } else {

    }
})
```

## Step 2

Open the ``||logic:Logic||`` Toolbox drawer again. From the **Comparison** section, drag out ``||logic:0 < 0||`` comparison block and drop it into the ``||logic:if then else||`` block, replacing ``true``. 

```blocks
forever(function () {
    if (0 < 0) {

    } else {

    }
})
```

## Step 3

Open the ``||sensors:Sensors||`` Toolbox drawer. From the **Color Sensor** section, drag out a ``||sensors:color sensor light||`` value block and drop it into the second slot of the ``||logic:0 < 0||`` comparison block, replacing the `0`.

```blocks
forever(function () {
    if (0 < sensors.color3.light(LightIntensityMode.Reflected)) {

    } else {

    }
})
```

## Step 4

If the value of the reflected light is greater than 40% (white or very light), our robot is outside the line, so steer to the left. In the ``||logic:0 < 0||`` comparison block change the compared value to `40` replacing `0`. 

```blocks
forever(function () {
    if (40 < sensors.color3.light(LightIntensityMode.Reflected)) {

    } else {

    }
})
```

## Step 5

Open the ``||motors:Motors||`` Toolbox drawer. Drag out **2** ``||motors:tank large motors||`` blocks and drop one of them into the ``||logic:if||`` part, and the other into the ``||logic:else||`` part of the ``||logic:if then else||`` block.

```blocks
forever(function () {
    if (40 < sensors.color3.light(LightIntensityMode.Reflected)) {
        motors.largeBC.tank(50, 50)
    } else {
        motors.largeBC.tank(50, 50)
    }
})
```

## Step 6

In the first ``||motors:tank large motors||`` block in the ``||logic:if||`` clause, change the speed values of the motors from ``50%``, ``50%`` to ``5%``, ``15%``. This slows down the robot, and steers it to the left (because the **C** motor is driving faster than the **B** motor).

```blocks
forever(function () {
    if (40 < sensors.color3.light(LightIntensityMode.Reflected)) {
        motors.largeBC.tank(5, 15)
    } else {
        motors.largeBC.tank(50, 50)
    }
})
```

# Step 7

In the second ``||motors:tank large motors||`` block in the ``||logic:else||`` clause, change the speed values of the motors from ``50%``, ``50%`` to ``15%``, ``5%``.  This slows down the robot, and steers it to the right (because the **B** motor is driving faster than the **C** motor).

```blocks
forever(function () {
    if (40 < sensors.color3.light(LightIntensityMode.Reflected)) {
        motors.largeBC.tank(5, 15)
    } else {
        motors.largeBC.tank(15, 5)
    }
})
```

## Step 8

Use the EV3 simulator to try out your code. 

![Brick with color sensors tracking a yellow line](/static/tutorials/line-following/line-following.gif)

Move the slider under the Color Sensor to change the reflected light and check that motors 
are moving as you would expect!

## Step 9

Plug your EV3 Brick into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the brick.

Attach a Color Sensor to Port 3 of your brick, and attach your brick to a driving base with large motors attached to Ports B and C. See the instructions for building a _Driving Base with Color Sensor Down_. Test your program by positioning your robot to the right of a dark, thick line and then let it drive! 
