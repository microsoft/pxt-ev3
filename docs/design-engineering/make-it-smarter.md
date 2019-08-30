# Make It Smarter and Faster

## Connect

### Design Brief

Design, build and program a robotic creature that can sense its environment and respond by moving.

https://www.youtube.com/watch?v=y9-A_C_08KY

* What do the robots in the video need to be able to sense, plan, and act?
* What senses do humans have and why are they important to us?
* How many human-like senses do you see the robots demonstrating?

### Brainstorm

Discuss different solutions to the design brief.

Think about:

* What kind of creature can it be?
* How can it move?
* What does it need to be aware so that it stays safe, well fed and warm (or cool)?
* Is it looking for food, a safe place to hide or a warm place to soak up the sun?
* Will the creature need to move fast or slow?
* Will it need to turn?
* Will it need to go backward?

![EV3 and bricks](/static/lessons/make-it-smarter/bricks.png)

## Construct

### Build

Think about a creature’s movement for inspiration. Your mechanism can be attached or unattached to the EV3 Brick. You can start by tinkering with the LEGO elements in the picture add then build on.

More building ideas:


* [EV3 Frames]
* [Color Sensor 1]
* [Gyro Sensor]
* [Ultrasonic Sensor]
* [Touch Sensor]
* [Jaw]
* [Leg 1] 
* [Leg 2]
* [Leg 3]

### ~hint

If clicking the above links doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~

### Program

Before you program, think about:

* How will you program the robot to sense?
* How will you program the robot to respond?
* Which programming blocks will you use?

### ~hint

**Hint:** Explore the different Sensor blocks in the Sensors Menu

### ~

### Sample Solution

The Insect uses its Ultrasonic Sensor to sense danger and move away from a threat.

https://www.youtube.com/watch?v=PoeYoiXHHE4
<br/>
The Insect solution combines these building ideas:

* [EV3 Frames]
* [Leg 2]
* [Leg 3]
* [Ultrasonic Sensor]

Four copies of Leg 3 are built: one for the front left, one for the back right, and two mirror copies for the front right and back left.

Building Instructions:

[![Insect robot](/static/lessons/make-it-smarter/insect-bot.jpg)](https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/insect-94b8a46f0dc5082c9d78ddb734626dc9.pdf)

### ~hint

If clicking the above images or links doesn't open the instructions, right-click on the link and choose "Save link as..." to download the PDF.

### ~

### Sample Solution

This program checks if the Ultrasonic Sensor senses something near.

The blocks inside the ``||loops:forever||`` loop have these actions:

1. Turn on the ``green`` EV3 Brick Status Light.
2. Wait for Ultrasonic Sensor to detect an object.
3. Turn on Motors ``A`` and ``D`` in opposite directions.
4. Wait for one and a half seconds (``1500`` milli seconds).
5. Reverse the direction of Motors ``A`` and ``D``.
6. Wait for one and a half seconds.
7. Stop all motors.
8. Make an insect chirping sound.
9. Loop continuously so that the insect wanders around when the Ultrasonic Sensor is detects something.

```blocks
forever(function () {
    brick.setStatusLight(StatusLight.Green)
    sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectDetected)
    motors.largeAD.tank(50, -50)
    pause(1500)
    motors.largeAD.tank(-50, 50)
    pause(1500)
    motors.stopAll()
    music.playSoundEffectUntilDone(sounds.animalsInsectChirp)
})
```

### Download and test

Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Contemplate

### Test and Analyze

As you work on your solution:
1. Describe one part of your design that worked especially well.
2. Describe one design change that you had to make.
3. What will you try next?

### Review and Revise

Take a moment to reflect on your robot solution.

Think about:

* Does your robot move when the sensor is activated?
* If not, what will you change to make the robot’s ability to sense and respond more obvious?
* What other behaviors can you add to the robot to make it more realistic?

Describe two ways you could improve your robot.

## Continue

Personalize your project:

* Add/remove LEGO elements to improve the way your robot moves.
* Click on the JavaScript tab and experiment with changing the values in the code.
* Add a custom image or sounds by adding blocks from the Brick or Music menus.
* Does your robot resemble a creature? Maybe add more craft materials to your project.

## Communicate

Here are some ideas:

* Create a video of your project, especially your final presentation and your robot’s performance. Explain some important features of your software program.
* Produce a building guide for your model by taking a series of photographs as you deconstruct it.
* Include an image of your program with comments.
* Add a team photograph!

Congratulations! What will you design next?


[EV3 Frames]: https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/ev3%20frames-5054ee378e624fb4cb31158d2fc8e5cf.pdf
[Color Sensor 1]: https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/color%20sensor_v1-16a7231bdc187cd88a8da120c68f58d5.pdf
[Gyro Sensor]: https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/gyro%20sensor-6f0fdbd82ae45fe0effa0ebf3f460f3d.pdf
[Ultrasonic Sensor]: https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/ultrasonic%20sensor-a56156c72e8946ed4c58c5e69f3520d3.pdf
[Touch Sensor]: https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/touch%20sensor-868fda1b9d6070a0a034fb22456a7fc9.pdf
[Jaw]: https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/jaw-ee93e8f3243e4d30cd34b0c337c33653.pdf
[Leg 1]: https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/leg%201-c14624046ea3a95148820ed404f5ac65.pdf
[Leg 2]: https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/leg%202-8855c35b990205f6b9d7130687a3d4db.pdf
[Leg 3]: https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/leg%203-575d52ef15fb79f1e4d3350d36607160.pdf
