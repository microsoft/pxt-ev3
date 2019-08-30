# Use

Build a robot and drive into the world of robotics!

![EV3 Driving Base full w/cuboid](/static/getting-started/EV3_GettingStarted_13.jpg)

In this project we will guide you through building a Driving Base Robot and programming it to move straight and turn. You will also build and Object Detector Module, and program it to detect an object. It’s a good idea to have done the [Try](/getting-started/try) sequence first.

## Connect

What if your school had a multipurpose robot? How would you use it?

![Apple Picker Robot](/static/getting-started/02_ApplePickerRobot.jpg)

Would you use it to clean the school or plant trees?

## Build Your Driving Base Robot

Build the robot driving base:

[![EV3 Driving Base](/static/lessons/common/ev3-driving-base.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)

### ~hint

If clicking the above image doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~

## Make It Move

**Code it:** Create a program that makes the Driving Base move forward and stop at the finish line, which is ``1`` meter away.

Start by building this program:

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(0, 50, 1, MoveUnit.Rotations)
})
```

* Drag a ``||motors:steer large motors B+C||`` block inside an ``||brick:on button||`` block.
* Click on the **(+)** sign.
* Change to ``1`` rotation.

### ~hint

**Hint:** You will have to modify the number of rotations until you find the number that matches the robot moving forward 1 meter and stopping.

### ~

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Make It Turn

**Code it:** Create a new program that turns the Driving Base 180 degrees.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.steer(-50, 50, 1, MoveUnit.Rotations)
})
```

### ~hint

**Hint:** You will have to modify the turn ratio and the number of rotations until the robot reaches 180 degrees.

### ~

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

## Add an Ultrasonic Sensor to Your Driving Base

Build and attach an Ultrasonic Sensor to your driving base:

[![EV3 Ultrasonic Sensor Driving Base Building Instructions Main Image](/static/lessons/common/ev3-ultrasonic-sensor-driving-base.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-ultrasonic-sensor-driving-base-61ffdfa461aee2470b8ddbeab16e2070.pdf)

### ~hint

If clicking the above image doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~

## Detect an Object

**Code it:**  Create a program that moves the Driving Base and makes it stop ``6`` cm from the Cuboid.

Create a new program:

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    motors.largeBC.tank(50, 50)
    sensors.ultrasonic4.setThreshold(UltrasonicSensorEvent.ObjectDetected, 6)
    sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectDetected);
    motors.stopAll()
})
```

* Drag a ``||motors:tank large motors B+C||`` motor block inside the ``||brick:on button||`` block.
* Drag the Ultrasonic Sensor threshold ``||sensors:set ultrasonic 4||``  block and place it below the motor block.
* Drag a ``|sensors:pause until ultrasonic 4||`` block and place it under the threshold block.
* Drag a ``||motors:stop all motors||`` block and place it below the sensor block.

### ~hint

**Hint:** You will have to modify the values of the Ultrasonic Sensor block until the robot reaches the desired position.

### ~

**Download:** Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the center button on the EV3 Brick to run the program.

Click on the **JavaScript** tab. Change and test the number value of the Ultrasonic
Sensor.

```typescript
sensors.ultrasonic4.setThreshold(UltrasonicSensorEvent.ObjectDetected, 10)
```

**Congratulations!**

You are ready to move on to the next steps.
Try a [Design Engineering](/design-engineering), [Coding](/coding), or [Maker](/maker) activity.
