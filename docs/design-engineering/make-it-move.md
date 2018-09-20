# Make It Move Without Wheels

## Connect

### Design Brief

Design, build and program a robot that can move itself using no wheels for locomotion.

![Make it move banner](/static/lessons/make-it-move/make-it-move-without-wheels.png)

Your robot will:

* Go a distance of at least 30cm
* Use at least one motor
* Use NO wheels for locomotion

### Brainstorm

In nature, creatures use many methods to get around. None of them, however, use wheels to move. Can we copy the method of animal locomotion with our robot? Using motors and legs, make a robot that can move without using any wheels.

## Construct

### Build

Think about a creature’s movement for inspiration. Will you make the robot walk, crawl, hop, or wiggle?  Your mechanism can be attached or unattached to the EV3 Brick. You can start by tinkering with the LEGO elements in the picture above and then build on.

### Building Hint

If you want some building help you can follow these instructions.

[![Toddle Bot](/static/lessons/make-it-move/toddle-bot.jpg)](https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/toddle%20bot-3dcad146d7f5deac4753f93e9dcc0739.pdf)

Click [here](https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/toddle%20bot-3dcad146d7f5deac4753f93e9dcc0739.pdf)

### ~hint

If clicking the above image or link doesn't open the instructions, right-click on the link and choose "Save link as..." to download the PDF.

### ~

### Program

Before you program, think about:

* How will you program the robot to move?
* How will you program the robot to stop?
* How will you program the robot to display the distance moved?

Which programming blocks will you use:

* To turn on and turn off the motor or motors?
* To display the distance moved?

### Sample Code

Example code of a robot that moves without wheels using one motor:

* The robot moves with ``large motor D`` rotating at ``-100`` speed
* The robot moves for ``30000`` milliseconds (30 seconds)
* The robot stops
* The robot displays the text ``"30cm"``

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeD.run(-100)
    loops.pause(30000)
    motors.stopAll()
    brick.showString("30cm", 1)
})
```

### Download and test

Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Contemplate

### Test and Analyze

Think about:

* Is the robot using something other than wheels to move? Trace the movement from the motor axle to the mechanism(s) that drives the robot forward, backward or sideways. Wheels can be used to stabilize the robot but not to drive it.
* Does the robot display the distance moved? Is it accurate? How do you know?
* What is one part of your design that worked well?
* What is a change that you need to make?
* What will you try next?

## Continue

### Personalize your project

* Add/remove LEGO elements to improve the way your robot moves. Will your robot walk, wiggle, hop, or slither? Will it move slower, faster or farther?
* Click on the JavaScript tab and experiment with changing the values in the code.
* Add a custom image or sounds by adding blocks from the Brick or Music menus.
* Does your robot resemble a creature? Add arts and crafts materials to your project.

## Communicate

* Create a video of your project, especially your final presentation and your robot’s performance.
* Explain some important features of your software program.
* Produce a building guide for your model by taking a series of photographs as you deconstruct it.
* Include an image of your program with comments.
* Add a team photograph!

Congratulations! What will you design next?
