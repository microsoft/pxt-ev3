# Make A System That Communicates

## Connect

### Design Brief

Design, build and program a robotic system that follows a path and communicates its position at least twice along the way.

https://www.youtube.com/watch?v=6piMI1JPDQc

* Robotic systems are built from smaller, related subsystems. Look at the automobile system shown in the video. What subsystems can you see?
* What kinds of robots follow a path?
* What kind of system do you want to make?

### Brainstorm

Discuss different solutions to the design brief.

Think about:
* What kind of motorized mechanism can be used to control the movements of a robot?
* How can the robot sense where it is along the path?
* How can the robot communicate its position?

![EV3 + LEGO Bricks](/static/lessons/make-it-communicate/ev3-plus-parts.jpg)

## Construct

### Build

You can start by tinkering with the LEGO elements in the picture and then build on.

More building ideas:

[![EV3 Frames](/static/lessons/make-it-communicate/ev3-frames.jpg)](https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/ev3%20frames-5054ee378e624fb4cb31158d2fc8e5cf.pdf)

[![Tracks](/static/lessons/make-it-communicate/ev3-tracks.jpg)](https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/tracks-32d7554813af3f25cf5012d54a4bad2b.pdf)

[![Color Sensor 2](/static/lessons/make-it-communicate/ev3-color-sensor2.jpg)](https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/color%20sensor_v2-e7fd54b6fa3cdfe36f414c1d2510f9cb.pdf)

### ~hint

If clicking the above images doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~


Build a path for your robot to follow. You can use electrical tape on a floor, or marker on paper. You can use objects as milestones to indicate a path that can be detected by either the Touch Sensor, Color Sensor, or Ultrasonic Sensor.

### Program

Before you program, think about:

* How will you program the robot to follow a path?
* How will you program the robot to communicate its position?
* Which programming blocks will you use?

### ~hint

Explore the different Motor and Sensor blocks in the programming menu.

### ~

### Sample Solution

[![Video: EV3 Track Rover](/static/lessons/make-it-communicate/ev3-track-rover.jpg)](https://legoeducation.23video.com/v.ihtml/player.html?token=79c99735f906403a4dd7f2909935983d&source=embed&photo%5fid=19857954)

The Track Rover follows a path using the color sensor. It identifies two locations by color.

Track Rover solution combines these building ideas:

* EV3 frames
* Tracks
* Color sensor 2

Two copies of the tracks are built: one for the right side and a mirror image for the left side.

[![Track rover assembled](/static/lessons/make-it-communicate/ev3-track-rover2.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/ev3-dep/building%20instructions/track-rover-bi-6aadb1b053df0c58a0dea108b5ce0eea.pdf)

### ~hint

If clicking the above image doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~

### Sample Program Solution

This program works with the Track Rover. If you create a different robot, adjust the program to fit your solution.

Program summary:

* If the Color Sensor sees black, Motor B runs at -50 power and Motor C turns off.
* If the Color Sensor sees white, Motor B turns off and Motor C runs at -50 power.
* If the Color Sensor sees green, all motors stop and the green sound plays.
* The robot waits one second, then motors move forward.
* If the Color Sensor sees red, all motors stop, and the red sound plays.
* The robot waits one second, then motors move forward.
* Loops unlimited.

```blocks
forever(function () {
    if (sensors.color3.color() == ColorSensorColor.Black) {
        motors.largeB.run(-50)
        motors.largeC.run(0)
    } else if (sensors.color3.color() == ColorSensorColor.White) {
        motors.largeC.run(-50)
        motors.largeB.run(0)
    } else if (sensors.color3.color() == ColorSensorColor.Green) {
        motors.stopAll()
        music.playSoundEffectUntilDone(sounds.colorsGreen)
        motors.largeBC.run(-50)
    } else if (sensors.color3.color() == ColorSensorColor.Red) {
        motors.stopAll()
        music.playSoundEffectUntilDone(sounds.colorsRed)
        motors.largeBC.run(-50)
    }
})
```

### Download and test

Click Download and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Contemplate

### Test and Analyze

As you work on your solution:

1. Describe one part of your design that worked especially well.
2. Describe one design change that you had to make.
3. What will you try next?


### Review and Revise

Take a moment to reflect on your robot solution.

Think about:

* Can the robot’s movement be more accurate?
* What are some ways that others have solved the problem?

Describe two ways you could improve your robot.

## Continue

### Personalize your project

* Add/remove LEGO elements to improve the way your robot moves.
* Click on the JavaScript tab and experiment with changing the values in the code.
* Add a custom image or sounds by adding blocks from the Brick or Music menus.

## Communicate

Here are some ideas:

* Create a video of your project, especially your final presentation and your robot’s performance.
* Explain some important features of your software program.
* Produce a building guide for your model by taking a series of photographs as you deconstruct it.
* Include an image of your program with comments.
* Add a team photograph!

Congratulations! What will you design next?
