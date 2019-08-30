# Line Detection

## Objective

Design ways to improve driving safety by helping to prevent drivers from falling asleep and causing an accident.

![Car driving on highway](/static/lessons/line-detection/car-driving.jpg)

## Connect

Make sure that you can answer the following questions:

* Can autonomous cars react to different traffic light signals?
* What can happen if a driver falls asleep while driving?
* How can we detect when a driver is falling asleep?

Think about what you have learned, then document it. Describe the problem in your own words. Creatively record your ideas and findings.

## Construct

Start by constructing this model. Read the building instructions [here](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-color-sensor-down-driving-base-d30ed30610c3d6647d56e17bc64cf6e2.pdf) first.

### ~hint

If clicking the above image doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~

![Color sensor on the driving base](/static/lessons/line-detection/color-sensor-driving.jpg)

## Program

Autonomous cars need to recognize and respond to traffic lights automatically.
First, create a program that will make your robot stop at red lights.
Make sure your robot is only responding to the color red.
Once you have succeeded, program your robot to drive forward again when the light changes from red to green.

There are two coding tasks for this lesson:

1. Create a program that will make your robot stop at red lights.
2. Create a program that drives the robot forward until the Color Sensor sees red. The robot then stops.

## Coding task 1 - Stop at red lights

**Goal:** Create a program that will make your robot stop at red lights.

### Step 1

Create a program that drives the robot forward until the Color Sensor sees red. The robot then stops.

Place a ``||motors:steer large B+C||`` block from ``||motors:Motors||`` under ``||loops:on start||``. Change the speed to 20%.

```blocks
motors.largeBC.steer(0, 20)
```

### Step 2

Place a ``||loops:while||`` loop block under ``||motors:steer large B+C||``.

```blocks
motors.largeBC.steer(0, 20)
while (true) {
}
```

### Step 3

Place a ``||sensors:pause until color detected||`` from ``||sensors:Sensors||`` inside the ``||loops:while||`` loop block. Change the color to red.

```blocks
motors.largeBC.steer(0, 20)
while (true) {
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
}
```

### Step 4

Place a ``||motors:stop all motors||`` block under the ``||sensors:pause until color detected||`` block.

Study the program...what do you think the program will do?

**Hint:** The motors will run until the Color Sensor senses the color red, then all motors will stop. The motors will run until the sensor reading in the while block is true.

```blocks
motors.largeBC.steer(0, 20)
while (true) {
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
    motors.stopAll()
}
```

### Step 5

Click `|Download|` and follow the instructions to get your code onto your EV3 Brick. Press the **center** button on the EV3 Brick to run the program.

## Coding task 2 - Detect light changes

**Goal:** Program your robot to drive forward again when the light changes from red to green.

### Step 1

Place a ``||loops:while||`` loop block under ``||loops:on start||``.

```blocks
while (true) {

}
```

### Step 2

Place a ``||motors:steer large B+C||`` block from ``||motors:Motors||`` inside the ``||loops:while||`` loop block. Change the speed to 20%.

```blocks
while (true) {
    motors.largeBC.steer(0, 20)
}
```
 
### Step 4

Place a ``||loops:while||`` loop block under the ``||motors:steer large B+C||``  block.

```blocks
while (true) {
    motors.largeBC.steer(0, 20)
    while (true) {

    }
}
```

### Step 5

Place a ``||sensors:pause until color detected||`` block from ``||sensors:Sensors||`` inside the ``||loops:while||`` loop block. Change the color to red.

```blocks
while (true) {
    motors.largeBC.steer(0, 20)
    while (true) {
        sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
    }
}
```

### Step 6

Place a ``||motors:stop all motors||`` block under the ``||sensors:pause until color detected||`` block.

```blocks
while (true) {
    motors.largeBC.steer(0, 20)
    while (true) {
        sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
        motors.stopAll()
    }
}
```

### Step 7

Place a ``||loops:while||`` loop block under the second ``||loops:while||`` loop block.

```blocks
while (true) {
    motors.largeBC.steer(0, 20)
    while (true) {
        sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
        motors.stopAll()
    }
    while (true) {

    }
}
```

### Step 8

Place a ``||sensors:pause unril color detected||`` block inside the new ``||loops:while||`` loop block. Change the color to red.

What do you think the program will do?

**Hint:** The motors will run until the Color Sensor detects the color red, then it will stop all motors. The motors will also run and not stop when the color sensor detects the color green.

```blocks
while (true) {
    motors.largeBC.steer(0, 20)
    while (true) {
        sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
        motors.stopAll()
    }
    while (true) {
        sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
    }
}
```

### Step 9

Click `|Download|` and follow the instructions to get your code onto your EV3 Brick. Press the **center** button on the EV3 Brick to run the program.
 
## Contemplate

To simulate what could happen if a driver falls asleep while driving, your robot could sound an alarm signal when it crosses the line. This feature is often available in new cars.

Program your robot to perform this function.

Think about what you have learned, then document it. Describe your pseudocode for this task. Creatively record your ideas, and findings.

### Programming hint

```blocks
motors.largeBC.steer(0, 20)
while (true) {
sensors.color3.pauseUntilColorDetected(ColorSensorColor.Yellow)
music.playSoundEffect(sounds.systemGeneralAlert)
}
while (true) {
    while (true) {
        sensors.color3.pauseUntilLightDetected(LightIntensityMode.Reflected, Light.Bright)
        motors.largeB.run(10)
        motors.largeC.run(-10)
    }
    while (true) {
        sensors.color3.pauseUntilLightDetected(LightIntensityMode.Reflected, Light.Bright)
        motors.largeA.run(-10)
        motors.largeA.run(10)
    }
}
```

## Continue

Program your robot to drive on “autopilot” along a given route. You will need to create a program that recognizes and responds to a dark line (or white line). You will create a line-following program and your robot will need to travel along the line without losing contact with it.

You will need to constantly debug your program in order to make your robot travel as smoothly as possible along the line.

### Programming hint

```blocks
while (true) {
    while (true) {
        sensors.color3.pauseUntilLightDetected(LightIntensityMode.Reflected, Light.Bright)
        motors.largeB.run(10)
        motors.largeC.run(-10)
    }
    while (true) {
        sensors.color3.pauseUntilLightDetected(LightIntensityMode.Reflected, Light.Bright)
        motors.largeB.run(-10)
        motors.largeC.run(10)
    }
}
```

## Share

Consider the following questions:

1. What challenged you?
2. Where there any surprises?
3. How could you improve your program?
4. Could your program have been more streamlined?
5. Have you used too many blocks?
6. Is there a more efficient way of building your program?
7. How could your program be used in real-world scenarios?

Think about what you have learned, then document it. Creatively record and present your ideas, creations, and findings.





