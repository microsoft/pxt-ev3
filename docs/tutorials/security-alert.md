# Security Alert

## Introduction @fullscreen

The Infrared Sensor uses infrared light waves to detect proximity to the robot. Build an security alert using the infrared sensor. 
 
![Brick in simulator with infrared sensor](/static/tutorials/security-alert/security-alert.gif)

## Step 1

Open the ``||sensors:Sensors||`` Toolbox drawer. Drag out an ``||sensors:on infrared||`` block onto the Workspace (you can place this anywhere). Use the second drop-down menu to select ``detected``.

![Sensor detect method dropdown selections](/static/tutorials/security-alert/detect-method-dropdown.png)

```blocks
sensors.infrared1.onEvent(InfraredSensorEvent.ObjectDetected, function () {

})
```

## Step 2

Open the ``||brick:Brick||`` Toolbox drawer. From the **Screen** section, drag out a ``||brick:show image||`` block onto the Workspace, and drop it into the ``||sensors:on infrared||`` block.

```blocks
sensors.infrared1.onEvent(InfraredSensorEvent.ObjectDetected, function () {
    brick.showImage(images.expressionsBigSmile)
})
```

## Step 3

In the ``||brick:show image||`` block, use the drop-down menu to select the **STOP** sign image. 
 
![Screen image selections](/static/tutorials/security-alert/show-image-dropdown.png)

```blocks
sensors.infrared1.onEvent(InfraredSensorEvent.ObjectDetected, function () {
    brick.showImage(images.informationStop1)
})
```

## Step 4

Open the ``||brick:Brick||`` Toolbox drawer. From the **Buttons** section, drag out a ``||brick:set status light||`` block onto the Workspace, and drop it after the ``||brick:show image||`` block. 

```blocks
sensors.infrared1.onEvent(InfraredSensorEvent.ObjectDetected, function () {
    brick.showImage(images.informationStop1)
    brick.setStatusLight(StatusLight.Orange)
})
```

## Step 5

In the ``||brick:set status light||`` block, use the drop-down menu to select the ``red flash`` light 
 
![Status light selection dropdown list](/static/tutorials/security-alert/set-status-light-dropdown.png)

```blocks
sensors.infrared1.onEvent(InfraredSensorEvent.ObjectDetected, function () {
    brick.showImage(images.informationStop1)
    brick.setStatusLight(StatusLight.RedFlash)
})
```

## Step 6

Open the ``||loops:Loops||`` Toolbox drawer. Drag a ``||loops:repeat||`` loop onto the Workspace, and drop it after the ``||brick:set status light||`` block. 

```blocks
sensors.infrared1.onEvent(InfraredSensorEvent.ObjectDetected, function () {
    brick.showImage(images.informationStop1)
    brick.setStatusLight(StatusLight.RedFlash)
    for (let i = 0; i < 4; i++) {

    }
})
```

## Step 7

Open the ``||music:Music||`` Toolbox drawer. Drag a ``||music:play sound effect until done||`` block onto the Workspace, and drop it into the ``||loops:repeat||`` loop.

```blocks
sensors.infrared1.onEvent(InfraredSensorEvent.ObjectDetected, function () {
    brick.showImage(images.informationStop1)
    brick.setStatusLight(StatusLight.RedFlash)
    for (let i = 0; i < 4; i++) {
        music.playSoundEffectUntilDone(sounds.animalsCatPurr)
    }
})
```

## Step 8

In the ``||music:play sound effect until done||`` block, use the drop-down menu to select ``information error alarm`` sound effect. 
 
![Sound effect dropdown selections](/static/tutorials/security-alert/play-sound-effect-dropdown.png)

## Step 9

Now, plug your @boardnickname@ into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the brick.

Attach an Infrared Sensor to Port 1 of your brick. Test your program by putting an object increasingly closer to the Infrared Sensor – your Intruder Alert should trigger when you get too close! 
