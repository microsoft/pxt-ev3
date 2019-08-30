# Autonomous Parking

Design cars that can park themselves safely without driver intervention.

![Autonomous parking graphic](/static/coding/autonomous-parking/auto-parking-connect.jpg)

## Connect

**Think about:**

* How do autonomous cars work?
* What would it take to ensure that autonomous cars are safe?
* What types of movements do autonomous cars need to perform?

## Construct

### Build

Build a @boardname@ vehicle that can park itself safely without driver intervention. Start by constructing this model:

[![EV3- Robot Driving Base](/static/coding/autonomous-parking/ev3-robot-driving-base.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)

### ~hint

If clicking the above image doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~

### Check

Before you program, check:

* Are all the wires correctly connected from the motors to ports B and C?
* Are the wheels correctly installed?
* Are the wheels rotating freely?

### Program

Write a program that will make the robot turn three times in various ways.

**Think about:**

* How will you make the robot turn in different ways?
* How can the robot make a three point turn?

### ~hint

Consider using these blocks in your solution:

```block
motors.largeBC.tank(50, 50)
pause(500)
```

### ~

### Sample Solution - Three Point Turn

1. When the brick button is pressed, turn the driving base right and stop after 1.5 seconds.
2. Turn the driving base left and stop after 1 second.
3. Move the driving base forward for 3 seconds.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.tank(75, 30)
    loops.pause(1500)
    motors.largeBC.tank(-30, -75)
    loops.pause(1000)
    motors.largeBC.tank(50, 50)
    loops.pause(3000)
})
```

### Download and test

Click Download and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Contemplate

Choose one of the following autonomous driving scenarios and create a program for it:

* Parallel parking
* Angle parking
* Perpendicular parking

### ~hint

Document pseudocode for your program before choosing programming blocks.

### ~

### Sample Solution - Parallel Parking

1. When the brick button is pressed, drive forward in a straight line for 3 rotations.
2. Wait for 1 second.
3. Reverse motor rotation while turning for 1.5 rotations.
4. Reverse motor rotation while turning the other way for 1.5 rotations.
5. Drive backward in a straight line for 0.5 rotations.
6. Drive forward in a straight line for 0.5 rotations.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(0, 50, 3, MoveUnit.Rotations)
    pause(1000)
motors.largeBC.steer(-50, -50, 1.5, MoveUnit.Rotations)
    motors.largeBC.steer(50, -50, 1.5, MoveUnit.Rotations)
    motors.largeBC.steer(0, -50, 0.5, MoveUnit.Rotations)
    motors.largeBC.steer(0, 50, 0.5, MoveUnit.Rotations)
})
```

### Download and test

Click Download and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### Differentiation

Create a program that simulates displaying appropriate warning lights while parking.

### ~hint

Consider using this block in your solution:

```block
brick.setStatusLight(StatusLight.OrangeFlash)
```

### ~

### Sample Solution - Simulating Reverse Gear and Reverse Warning Lights

1. When the brick button is pressed, drive forward in a straight line for 3 rotations.
2. Wait for 1 second.
3. Set brick status light to orange flash.
4. Reverse motor rotation while turning for 1.5 rotations.
5. Reverse motor rotation while turning the other way for 1.5 rotations.
6. Drive backward in a straight line for 0.5 rotations.
7. Set brick status light to off.
8. Drive forward in a straight line for 0.5 rotations.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(0, 50, 3, MoveUnit.Rotations)
    pause(1000)
    brick.setStatusLight(StatusLight.OrangeFlash)
    motors.largeBC.steer(-50, -50, 1.5, MoveUnit.Rotations)
    motors.largeBC.steer(50, -50, 1.5, MoveUnit.Rotations)
    motors.largeBC.steer(0, -50, 0.5, MoveUnit.Rotations)
    brick.setStatusLight(StatusLight.Off)
    motors.largeBC.steer(0, 50, 0.5, MoveUnit.Rotations)
})
```

### Download and test

Click Download and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

### Share

**Think about:**

* What challenged you?
* Were there any surprises?
* How can you improve your program?
* Can your program be more streamlined? Have you used too many blocks?
* Is there a more efficient way to build your program?
* How can your program be used in real-world scenarios?

## Continue

* Click on the JavaScript tab and experiment with changing the values in the code.
* Add a custom image or sounds from the Brick or Music menus.
* Create a video of your project, especially your final presentation and your robot’s performance. Explain some important features of your software program.
* Include an image of your program with comments.
* Add a team photograph!

Congratulations! What will you design next?
