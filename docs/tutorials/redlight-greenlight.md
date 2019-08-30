# Red Light, Green Light

## Introduction @unplugged

Use the ``||sensors:pause until color sensor detected||`` block to play Red Light, Green Light with your @boardname@ robot! 

![Brick simulation with color sensor and motors](/static/tutorials/redlight-greenlight/redlight-greenlight.gif)

## Step 1

Open the ``||sensors:Sensors||`` Toolbox drawer. Drag out **2** ``||sensors:pause until color sensor detected||`` blocks onto the Workspace, and drop them into the ``||loops:forever||`` loop.

```blocks
forever(function () { 
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Blue) 
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Blue) 
}) 
```

## Step 2

In the first ``||sensors:pause until color sensor detected||`` block, use the second drop-down menu to select the Green color.  In the second ``||sensors:pause until color sensor detected||`` block, use the second drop-down menu to select the Red color. 

![Color selection dropdown](/static/tutorials/redlight-greenlight/pause-color-sensor-dropdown.png)

```blocks
forever(function () { 
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Green) 
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red) 
}) 
```

## Step 3

Open the ``||motors:Motors||`` Toolbox drawer. Drag out a ``||motors:tank motors||`` block onto the Workspace, and drop in between the ``||sensors:pause until color sensor detected||`` blocks.

```blocks
forever(function () { 
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Green) 
    motors.largeBC.tank(50, 50) 
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red) 
}) 
```

## Step 4

Open the ``||motors:Motors||`` Toolbox drawer. Drag out a ``||motors:stop all motors||`` block onto the Workspace, and drop it in after the second ``||sensors:pause until color sensor detected||`` block in the ``||loops:forever||`` loop.

```blocks
forever(function () { 
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Green) 
    motors.largeBC.tank(50, 50) 
    sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red) 
    motors.stopAll() 
})
```

## Step 5
 
Now, plug your EV3 Brick into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the EV3 Brick.

Attach a Color Sensor to Port 3 and attach your EV3 Brick to a driving base with Large Motors attached to Ports B and C. See the building instructions for: _Driving Base with Color Sensor Forward_. Test your program by putting a green or red piece of paper or LEGO brick in front of the Color Sensor.
