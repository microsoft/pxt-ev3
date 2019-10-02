# Pause On Start

## Introduction @unplugged

Sometimes you don't want your program to run right away... you can use a button to wait before moving the motors.

## Step 1

Let's start by showing an image on the screen so the user knows that the robot is ready and waiting.

```blocks
brick.showImage(images.informationStop1)
```

## Step 2

Drag the ``||brick:pause until enter pressed||`` button to wait for the user to press the Enter button.

```blocks
brick.showImage(images.informationStop1)
brick.buttonEnter.pauseUntil(ButtonEvent.Pressed)
```

## Step 3

Add all the motor and sensor code you want after those blocks!

```blocks
brick.showImage(images.informationStop1)
brick.buttonEnter.pauseUntil(ButtonEvent.Pressed)
brick.showImage(images.expressionsBigSmile)
motors.largeBC.tank(50, 50, 1, MoveUnit.Seconds)
```
