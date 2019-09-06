# Robot 2 Lesson

## Step 1 Build Your Driving Base Robot @unplugged

Build the robot driving base:

[![EV3 Driving Base](/static/lessons/common/ev3-driving-base.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)

If clicking the above image doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.


## Step 2 Show an image and move @fullscreen

Add the blocks to show an image and move the motors **B+C** for ``1`` rotation.

```blocks
brick.showMood(moods.neutral)
motors.largeBC.steer(0, 50, 1, MoveUnit.Rotations)
```

## Step 6 Brick button @fullscreen

Let's change the code so that your robot moves when the **UP** button is pressed.
Add a ``||brick:on button enter||`` block and move the ``||motors:steer motors||`` under it.
After downloading your code, press **UP** to move the robot.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(0, 50, 1, MoveUnit.Rotations)
})
brick.showMood(moods.neutral)
```

## Step 6 Braking @fullscreen

When the motors are done turning, the robot keeps on moving for a short distance. 
Turn on the **brakes**, so that your robot stops immediately.
Drag a ``||motors:set brake||`` block into the ``||loops:on start||`` and set it **ON** to the BC motors.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(0, 50, 1, MoveUnit.Rotations)
})
brick.showMood(moods.neutral)
motors.largeBC.setBrake(true)
```


## Step 8 Left and Right turn @fullscreen

Let's make the robot turn to the left when the **LEFT** button is pressed on the brick (and same for the right button).
Add a ``||steer motors||`` and change the turn ratio to go left.

```blocks
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(-50, 50, 1, MoveUnit.Rotations)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(50, 50, 1, MoveUnit.Rotations)
})
```

## Step 9 Backwards @fullscreen

Let's make the robot turn to the right when the **RIGHT** button is pressed on the brick.
Add a ``||steer motors||`` and change the speed to be negative. This will make the motor go backwards.

```blocks
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(0, -50, 1, MoveUnit.Rotations)
})
```

## Step 10 Add a Ultrasonic sensor @fullscreen

Add a Ultrasonic sensor to your driving base.

[![EV3 Driving Base with Ultrasonic Sensor](/static/lessons/common/ev3-ultrasonic-sensor-driving-base.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-ultrasonic-sensor-driving-base-61ffdfa461aee2470b8ddbeab16e2070.pdf)

If clicking the above images don't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

## Step 11 @fullscreen

Create a program that moves the Driving Base and makes it stop 6 cm from the Cuboid.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(0, 50)
    pauseUntil(() => sensors.ultrasonic4.distance() < 6)
    motors.largeBC.stop()
})
```

Try sending your robot towards a wall!