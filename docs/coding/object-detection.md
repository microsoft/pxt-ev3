# Object Detection

Design ways to avoid accidents between vehicles and objects in the road.

![Deer in the road](/static/coding/object-detection/road-deer.jpg)

## Connect

Think about:

* In what driving situations can a car hit an obstacle?
* What do you need to be aware of to avoid collisions with obstacles?
* What causes traffic jams in high density areas?

## Construct

### Build

Build a @boardname@ vehicle that can avoid accidents between vehicles and objects in the road. Start by constructing this model:

[![EV3 Robot Driving Base](/static/coding/object-detection/ev3-robot-driving-base.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-ultrasonic-sensor-driving-base-61ffdfa461aee2470b8ddbeab16e2070.pdf)

Build an obstacle for your robot to detect. You can build the **cuboid model** out of LEGO bricks or an obstacle of your choice.

[![Cubiod block](/static/coding/object-detection/ev3-cuboid.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-cuboid-dc93b2e60bed2981e76b3bac9ea04558.pdf)

### ~hint

If clicking the above images doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~

### Check

Before you program, check:

* Are all the wires correctly connected from the motors to ports B and C?
* Are the wheels correctly installed?
* Are the wheels rotating freely?
* Are the wires connected from the Ultrasonic Sensor to port 4?

### Program

* Program your robot to detect any obstacles that might appear while the robot is moving forward (or backward).
* Make the robot stop when it detects an object that is less than 20 cm away.

Before you program, think about:
* How will you program the robot to detect obstacles?
* How will you program the robot to stop at obstacles?
* Which programming blocks will you use?

### ~hint

Consider using these blocks in your solution:

```block
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {

})
motors.largeBC.steer(0, 50)
pauseUntil(() => true)
let near = sensors.ultrasonic4.distance() < 20
motors.stopAll()
```

### ~

### Sample Solution

1. Start the program when EV3 ``enter`` button is pressed.
2. Turn motors ``B`` and ``C`` on at speed ``50``.
3. Wait until Ultrasonic Sensor detects an obstacle at a distance of less than ``20`` cm.
4. Stops all motors.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(0, 50)
    pauseUntil(() => sensors.ultrasonic4.distance() < 20)
    motors.stopAll()
})
```

### Download and test

Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the ``center`` button on the EV3 Brick to run the program.

## Contemplate

On the road, when a driver sees and object, they slow their car down before coming to a full stop.

Program your EV3 Driving Base to do the same.

If the Ultrasonic Sensor:

* Detects an object less than `10` cm away, make the robot stop.
* Detects an object between `10` and `20` cm away, make the robot slow down.
* Does not detect any object, continue to move at full speed.

### ~hint

Consider using this block in your solution:

```block
if (true) {
}
```

### ~

### Sample Solution

```blocks
loops.forever(function () {
    motors.largeBC.steer(0, 50)
    if (sensors.ultrasonic4.distance() < 10) {
        motors.stopAll()
    } else if (sensors.ultrasonic4.distance() < 20) {
        motors.largeBC.steer(0, 10)
    }
})
```

### Download and test

Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the ``center`` button on the EV3 Brick to run the program.

## Continue

* Get together with other building teams and make a traffic jam by placing all of your robots in a line with varying amounts of space between them.
* Have everyone start their robots at the same time and see what happens.
* Refine your programs so that all of the robots continue driving at the same speed with equal distances between them.
* Click on the JavaScript tab and experiment with changing the values in the code.
* Add a custom image or sounds from the Brick or Music menus.

### Share

* Share what you think “efficiency in programming” means.
* Explore the different solutions other programmers came up with.
* Create a video of your project, especially your final presentation and your robot’s performance. Explain some important features of your software program.
* Include an image of your program with comments.
* Add a team photograph!

Congratulations! What will you design next?
