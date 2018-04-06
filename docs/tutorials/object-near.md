# Object Near?

## Introduction @fullscreen

The digital Ultrasonic Sensor generates sound waves and reads their echoes to detect and measure distance from objects in centimeters. Build a program that will detect when an object is nearby.

![Simualtor with brick and ultrasonic sensor](/static/tutorials/object-near/ultrasonic-near.gif)

## Step 1

Open the ``||sensors:Sensors||`` Toolbox drawer. From the **Ultrasonic Sensor** section, drag out an ``||sensors:on ultrasonic||`` block onto the Workspace (you can place this anywhere).

```blocks
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {

})
```

## Step 2

Open the ``||music:Music||`` Toolbox drawer. Drag out a ``||music:play sound effect||`` block onto the Workspace, and drop it into the ``||sensors:on ultrasonic||`` block.

```blocks
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    music.playSoundEffect(sounds.animalsCatPurr)
})
```

## Step 3

In the ``||music:play sound effect||`` block, use the drop-down menu to select the ``information detected`` sound effect. 
 
![Select sound effect from dropdown](/static/tutorials/object-near/play-sound-effect-dropdown.png)

```blocks
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    music.playSoundEffect(sounds.informationDetected)
})
```

## Step 4

Open the ``||brick:Brick||`` Toolbox drawer. From the **Screen** section, drag out a ``||brick:show value||`` block onto the Workspace, and drop after the ``||music:play sound effect||`` block.

```blocks
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    music.playSoundEffect(sounds.informationDetected)
    brick.showValue("", 0, 0)
})
```

## Step 5

In the ``||brick:show value||`` block, type the text `"Distance (cm)"` in the first slot.

```blocks
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    music.playSoundEffect(sounds.informationDetected)
    brick.showValue("Distance (cm)", 0, 0)
})
```

## Step 6

Open the ``||sensors:Sensors||`` Toolbox drawer. From the **Ultrasonic Sensor** section, drag out an ``||sensors:ultrasonic distance||`` block and drop into the second slot in the ``||brick:show value||`` block replacing the first `0`. 

```blocks
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    music.playSoundEffect(sounds.informationDetected)
    brick.showValue("Distance (cm)", sensors.ultrasonic4.distance(), 0)
})
```

## Step 7

Open the ``||sensors:Sensors||`` Toolbox drawer, and scroll to the bottom. From the **Threshold** section, drag out a ``||sensors:set ultrasonic||`` block onto the Workspace, and drop it into the ``||loops:on start||``.

When an object is near, our brick will say `"detected"` and then display the distance away that the object is detected in centimeters. We can also set the threshold value for determining when an object is "near".

```blocks 
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    music.playSoundEffect(sounds.informationDetected)
    brick.showValue("Distance (cm)", sensors.ultrasonic4.distance(), 0)
})
sensors.ultrasonic4.setThreshold(UltrasonicSensorEvent.ObjectDetected, 0)
```

## Step 8

In the ``||sensors:set ultrasonic||`` block, type `50` as the value in centimeters for the distance that the object will be detected in.

```blocks
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectNear, function () {
    music.playSoundEffect(sounds.informationDetected)
    brick.showValue("Distance (cm)", sensors.ultrasonic4.distance(), 0)
})
sensors.ultrasonic4.setThreshold(UltrasonicSensorEvent.ObjectNear, 50)
```

## Step 9

Now, plug your @boardname@ into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the brick.

Attach an Ultrasonic Sensor to Port 4 of your brick. Test your program by putting an object at different distances in front of the Ultrasonic Sensor – an object 50 centimeters or closer should be detected. 
