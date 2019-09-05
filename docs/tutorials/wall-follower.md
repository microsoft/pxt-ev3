# Wall Follower

## Introduction @unplugged

This tutorial shows you how to use the ultrasonic sensor to 
move a [EV3 Driving Base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)
along a wall.

Your ultrasonic sensor should be placed horizontally, near the driving wheel, facing the wall.

## Step 1 Measure distance

Declare a new variable ``distance`` and store the distance from 
the ultrasonic sensor on port 4.

```blocks
let distance = 0
forever(function () {
    distance = sensors.ultrasonic4.distance()
})
```

## Step 2 Show distance

Use a ``||brick:show value||`` block to display the distance value on the screen.
This is **very** helpful when you are debugging your code on the robot.

Once your code is ready, download it to your robot and check that the measured distance looks ok.

```blocks
let distance = 0
forever(function () {
    distance = sensors.ultrasonic4.distance()
    brick.showValue("distance", distance, 1)
})
```

## Step 3 Goal

Declare a new variable ``goal`` and assign it to ``10`` in ``on start``. 
The value should be the distance in centimeters between your robot and the wall.

```blocks
let goal = 0
goal = 10
```

## Step 4 Compute Error

Declare a new variable ``error`` and assign a difference between ``distance`` and ``goal``.
We will use this value to determine how much the robot needs to correct its trajectory.

```blocks
let distance = 0
let goal = 0
let error = 0
goal = 10
forever(function () {
    distance = sensors.ultrasonic4.distance()
    brick.showValue("distance", distance, 1)
    error = distance - goal
    brick.showValue("error", error, 2)
})
```

## Step 5 Show Error

Just like ``distance``, use ``||brick:show value||`` to display the value of the error (line 2).
This will allow you to debug your code while it is running on the robot.

Download your program to the robot and check that the error goes to ``0`` when
the robot is around 10cm from the wall.

```blocks
let distance = 0
let goal = 0
let error = 0
goal = 10
forever(function () {
    distance = sensors.ultrasonic4.distance()
    brick.showValue("distance", distance, 1)
    error = distance - goal
    brick.showValue("error", error, 2)
})
```

## Step 6 Kp

Declare a new variable ``kp`` and assign it to ``1``.
This number determines how to convert the error into a ``turn ratio`` for the steer block.
For starter, set it to 1 and we will go through the steps to tune its value later on.
As usual, also use ``||brick:show value||`` to display the value of ``kp`` on the screen (line 3).

```blocks
let distance = 0
let goal = 0
let error = 0
let kp = 0
goal = 10
kp = 1
forever(function () {
    distance = sensors.ultrasonic4.distance()
    brick.showValue("distance", distance, 1)
    error = distance - goal
    brick.showValue("error", error, 2)
    brick.showValue("kp", kp, 3)
})
```

## Step 7 Turn ratio

Declare a new variable ``turnratio`` and store the product of ``error`` and ``kp`` in it.
Also use ``||brick:show value||`` to display its value on screen.

Download the program on the robot and try moving the robot around the wall. You should see
the value of ``turnratio`` change similarly to ``error``.

```blocks
let distance = 0
let goal = 0
let error = 0
let kp = 0
let turnratio = 0
goal = 10
kp = 1
forever(function () {
    distance = sensors.ultrasonic4.distance()
    brick.showValue("distance", distance, 1)
    error = distance - goal
    brick.showValue("error", error, 2)
    brick.showValue("kp", kp, 3)
    turnratio = error * kp
    brick.showValue("turn", turnratio, 4)
})
```

## Step 8 Steering

Add a ``||motors:steer motors||`` block for ``large B+C`` at 35% and place the ``turnratio``
variable for the turn value.

Download the code to your robot and try it out. Does it follow the wall?... 
Not really, this is because we need to tune the ``kp`` variable.

```blocks
let distance = 0
let goal = 0
let error = 0
let kp = 0
let turnratio = 0
goal = 10
kp = 1
forever(function () {
    distance = sensors.ultrasonic4.distance()
    brick.showValue("distance", distance, 1)
    error = distance - goal
    brick.showValue("error", error, 2)
    brick.showValue("kp", kp, 3)
    turnratio = error * kp
    brick.showValue("turn", turnratio, 4)
    motors.largeBC.steer(turnratio, 35)
})
```

## Step 9 Tuning kp

As mentioned in a previous step, we need to find the right value for kp so that the robot
follows the wall properly. This tuning can be tedious so we are going to the brick buttons
to speed up the process.

Add ``||brick:on button||`` blocks to handle the left and right button pressed. When left is pressed, change ``kp`` by ``-1``. When right is pressed, change ``kp`` by 1.

Download your code to the robot and change the values of ``kp`` until the robot follows the wall. (Tip try something around -5 / -10).

```blocks
let kp = 0
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    kp += -1
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    kp += 1
})
```

## Step 10 @unplugged

Well done! Your robot is using the ultrasonic distance
to correct is trajectory using a proportional controller!

The robot will be more precise if it goes slow... Try using a variable
and the brick up and down events to control the speed as well.