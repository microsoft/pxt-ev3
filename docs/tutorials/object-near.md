# Object Near?

## Introduction @unplugged

The digital Ultrasonic Sensor generates sound waves and reads their echoes to detect and measure distance from objects in centimeters. Build a program that will detect when an object is nearby.

![Simulator with brick and ultrasonic sensor](/static/tutorials/object-near/ultrasonic-near.gif)

## Step 1

Open the ``||variables:Variables||`` Toolbox drawer. Pull a ``||variables:set item to||`` block onto the Workspace and place it into the ``||loops:forever||`` block.

```blocks
let item = 0
forever(function () {
    item = 0
})
```

## Step 2

Go to the ``||variables:set item to||`` block and click the variable name dropdown and select "Rename variable...". In the window that pops up, rename the variable to ``nearness`` and click **Ok**.

```blocks
let nearness = 0
forever(function () {
    nearness = 0
})
```

## Step 3

Open the ``||sensors:Sensors||`` Toolbox drawer. Drag the ``||sensors:ultrasonic distance||`` out and use it to replace the `0` in the ``||variables:set nearness to||`` block. 

```blocks
let nearness = 0
forever(function () {
    nearness = sensors.ultrasonic4.distance()
})
```

## Step 4

Get an ``||logic:if then||`` block from the ``||logic:Logic||`` drawer and place it below ``||variables:set nearness to||``. Find the ``||logic:0 < 0||`` conditional block and replace the ``true`` value of the ``||logic:if then||`` condition with it.

```blocks
let nearness = 0
forever(function () {
    nearness = sensors.ultrasonic4.distance()
    if (0 < 0) {

    }
})
```

## Step 5

In the ``||logic:0 < 0||`` conditional, put the ``||variables:nearness||`` variable from the ``||variables:Variables||`` drawer in the first slot. Change the value of `0` in the second slot to `50`. This sets our range for a near object.

```blocks
let nearness = 0
forever(function () {
    nearness = sensors.ultrasonic4.distance()
    if (nearness < 50) {

    }
})
```

## Step 6

Go get a ``||brick:show value||`` block from the ``||brick:Brick||`` Toolbox drawer and put it  inside the ``||logic:if then||``. Set the string in the first slot to `"Distance (cm)"`. Get another ``||variables:nearness||`` and drop it into the second slot.

```blocks
let nearness = 0
forever(function () {
    nearness = sensors.ultrasonic4.distance()
    if (nearness < 50) {
        brick.showValue("Distnace (cm)", nearness, 1)
    }
})
```

## Step 7

Now, let's add a sound as an alert when something is near. In the ``||music:Music||`` drawer, get the ``||music:play sound effect||`` and put it just below the ``||brick:show value||``.

```blocks
let nearness = 0
forever(function () {
    nearness = sensors.ultrasonic4.distance()
    if (nearness < 50) {
        brick.showValue("Distnace (cm)", nearness, 1)
        music.playSoundEffect(sounds.animalsCatPurr)
    }
})
```

## Step 8

In the ``||music:play sound effect||`` block, use the drop-down menu to select the ``information detected`` sound effect. 

![Select sound effect from dropdown](/static/tutorials/object-near/play-sound-effect-dropdown.png)

When an object is near, our brick will display the distance away that the object is detected in centimeters and then say `"detected"`.

```blocks
let nearness = 0
forever(function () {
    nearness = sensors.ultrasonic4.distance()
    if (nearness < 50) {
        brick.showValue("Distnace (cm)", nearness, 1)
        music.playSoundEffect(sounds.informationDetected)
    }
})
```

## Step 9

To give a little time to see the message, put a ``||loops:pause||`` after the ``||music:play sound effect||`` block. Change the time from `100` to `1500` milliseconds. Pull out a ``||brick:clear screen||`` and put it after the ``||loops:pause||``.

```blocks
let nearness = 0
forever(function () {
    nearness = sensors.ultrasonic4.distance()
    if (nearness < 50) {
        brick.showValue("Distnace (cm)", nearness, 1)
        music.playSoundEffect(sounds.informationDetected)
        pause(1500)
        brick.clearScreen()
    }
})
```

## Step 10

Now, plug your EV3 Brick into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the EV3 Brick.

Attach an Ultrasonic Sensor to Port 4 of your EV3 Brick. Test your program by putting an object at different distances in front of the Ultrasonic Sensor – an object 50 centimeters or closer should be detected. 
