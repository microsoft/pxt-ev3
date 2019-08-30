# Line Detection

Design ways to improve driving safety by helping to prevent drivers from falling asleep and causing an accident.

![Car following the line on the road](/static/coding/line-detection/car-road-line.jpg)

## Connect

Think about:

* How can autonomous cars react to different traffic light signals?
* What can happen if a driver falls asleep while driving?
* How can we detect when a driver is falling asleep?

## Construct

### Build

Build a @boardname@ vehicle that can help prevent drivers from falling asleep and causing an accident. Start by constructing this model:

[![EV3 robot with color sensor](/static/coding/line-detection/ev3-robot-color-sensor-down.jpg)](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-color-sensor-down-driving-base-d30ed30610c3d6647d56e17bc64cf6e2.pdf)

Build red and green “lights” for your robot to detect. You can use LEGO bricks, colored tape, or marker on white paper. Building instructions:

[![IMAGE: Color Squares](/static/coding/line-detection/ev3-color-squares.jpg)](https://le-www-live-s.legocdn.com/sc/media/files/support/mindstorms%20ev3/building-instructions/design%20engineering%20projects/color%20squares-0a88dfd98bb2e64b5b8151fc422bae36.pdf)

### ~hint

If clicking the above images doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~

### Check

Before you program, check:

* Are all the wires correctly connected from the motors to ports B and C?
* Are the wheels correctly installed?
* Are the wheels rotating freely?
* Are the wires connected from the Color Sensor to port 3?

![EV3 Driving Base](/static/coding/line-detection/ev3-robot-driving-base.jpg)

### Program

Autonomous cars need to recognize and respond to traffic lights automatically. Create a program that will make your robot stop at red lights. Make sure your robot is only responding to the color red. Once you have succeeded, program your robot to drive forward again when the light changes from red to green.

Before you program, think about:

* How will you program the robot to detect a color?
* How will you program the robot to stop at a color?
* Which programming blocks will you use?

### ~ hint

Consider using these blocks in your solution:

```block
loops.forever(function () {

})
motors.largeBC.steer(0, 50)
sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
motors.stopAll()
```

### ~

### Sample Solution - Red light detection

1. Loop forever.
2. Start motors ``B`` and ``C`` (drive forward).
3. Wait for the color sensor to detect the color red.
4. Stop all motors.

```blocks
loops.forever(function () {
    motors.largeBC.steer(0, 50)
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
    motors.stopAll()
})
```

### Download and test

Click **Download** and follow the instructions to get your code onto your EV3 Brick.

Congratulations! Your robot can stop at a red light.

Now add to your program and have your robot to drive forward again when the light changes from red to green.

### Sample Solution - Red and green light detection in a loop

1. Start motors ``B`` and ``C`` (drive forward).
2. Wait for the color sensor to detect the color red.
3. Stop all motors.
4. Wait for the color sensor to detect the color green.
5. Loop forever.

```blocks
loops.forever(function () {
    motors.largeBC.steer(0, 50)
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
    motors.stopAll()
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Green)
})
```

### Download and test

Click **Download** and follow the instructions to get your code onto your EV3 Brick.

## Contemplate

To simulate what could happen if a driver falls asleep while driving, your robot could sound an alarm signal when it crosses the line. This feature is often available in new cars.

Program your robot to perform this function.

Draw a dark line with tape or marker for your robot to cross.

### ~hint

Consider using these blocks in your solution:

```block
motors.largeBC.steer(0, 50)
music.playSoundEffect(sounds.systemGeneralAlert)
```
### ~

### Sample Solution - Line detection in a loop

1. Start motors ``B`` and ``C`` (drive forward with a curve toward the line).
2. Wait for the color sensor to detect the color black.
3. Play sound effect ``system general alert``.
4. Start motors ``B`` and ``C`` (drive forward with a curve away from the line).
5. Wait for the color sensor to detect the color white.
6. Loop forever.

```blocks
loops.forever(function () {
    motors.largeBC.steer(-30, 20)
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Black)
    music.playSoundEffect(sounds.systemGeneralAlert)
    motors.largeBC.steer(30, 20)
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.White)
})
```

#### Download and test

Click **Download** and follow the instructions to get your code onto your EV3 Brick.

#### Differentiation

Program your robot to drive on “autopilot” along a given route. You will need to create a program that recognizes and responds to a dark line (or white line). You will create a line-following program and your robot will need to travel along the line without losing contact with it.

You will need to constantly debug your program in order to make your robot travel as smoothly as possible along the line.

### ~hint

Consider using these blocks in your solution:

```block
while (true) {

}
motors.largeBC.steer(0, 50)
```

> **- OR -**

```block
if (true) {

} else {

}
```

### ~

### Sample Solutions - Line Following in Loop

#### Method 1

1. While the Color Sensor detects the color black, start motors ``B`` and ``C`` (drive forward with a curve toward the line).
2. While the Color Sensor detects the color white, start motors ``B`` and ``C`` (drive forward with a curve away from the line).
3. Loop forever.

```blocks
forever(function () {
    while (sensors.color3.color() == ColorSensorColor.Black) {
        motors.largeBC.steer(-30, 50)
    }
    while (sensors.color3.color() == ColorSensorColor.White) {
        motors.largeBC.steer(30, 50)
    }
})
```

#### Method 2

1. If the Color Sensor detects the color black, start motors ``B`` and ``C`` (drive forward with a curve toward the line).
Else the Color Sensor detects the color white, start motors ``B`` and ``C`` (drive forward with a curve away from the line).
2. Loop forever.

```blocks
forever(function () {
    if (sensors.color3.color() == ColorSensorColor.Black) {
        motors.largeBC.steer(-30, 50)
    } else {
        motors.largeBC.steer(30, 50)
    }
})
```

### Download and test

Click **Download** and follow the instructions to get your code onto your EV3 Brick.

### Share

Think about:

* What challenged you?
* Were there any surprises?
* How can you improve your program?
* Can your program be more streamlined? Have you used too many blocks?
* Is there a more efficient way to build your program?
* How can your program be used in real-world scenarios?

Personalize:

* Click on the **JavaScript** tab and experiment with changing the values in the code.
* Add a custom image or sounds from the ``||brick:Brick||`` or ``||music:Music||`` menus.
* Create a video of your project, especially your final presentation and your robot’s performance. Explain some important features of your software program.
* Include an image of your program with comments.
* Add a team photograph!

Congratulations! What will you design next?
