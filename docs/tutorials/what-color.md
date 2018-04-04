# What Color is it?

## Introduction @fullscreen

Use the Color sensor to detect different colors.

![Simulator view with color sensor](/static/tutorials/what-color/color-detector.gif)

## Step 1

Open the ``||brick:Brick||`` Toolbox drawer. From the **Screen** section, drag out a ``||brick:show string||`` block onto the Workspace, and drop it into the ``||loops:on start||`` block.

```blocks
brick.showString("Hello world", 1)
```

## Step 2

In the ``||brick:show string||`` block, type the text ``"What color?"`` replacing ``"Hello World"``.

```blocks
brick.showString("What color?", 1) 
```

## Step 3

Open the Sensors Toolbox drawer.  From the Color Sensor section, drag out 3 On Color Sensor Detected blocks onto the Workspace (you can place these anywhere). 
 
In the On Color Sensor Detected blocks, use the second drop-down menu to select Red, Green, and Yellow colors. 

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Red, function () {

})
sensors.color3.onColorDetected(ColorSensorColor.Green, function () {

})
sensors.color3.onColorDetected(ColorSensorColor.Yellow, function () {

})
brick.showString("What color?", 1)
```

## Step 4

Open the ``||brick:Brick||`` Toolbox drawer. From the Buttons section, drag out a **3** ``||brick:set status light||`` blocks onto the Workspace, and drop one of them each into the On Color Detected blocks.

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Red, function () {
    brick.setStatusLight(StatusLight.Orange)
})
sensors.color3.onColorDetected(ColorSensorColor.Green, function () {
    brick.setStatusLight(StatusLight.Orange)
})
sensors.color3.onColorDetected(ColorSensorColor.Yellow, function () {
    brick.setStatusLight(StatusLight.Orange)
})
brick.showString("What color?", 0)
```

## Step 5

In the Set Status Light blocks, use the drop-down menu to change the lights to Red, Green, and Orange corresponding to the different colors detected.  Note, there is no Yellow status light, so we’ll use Orange instead.

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Red, function () {
    brick.setStatusLight(StatusLight.Red)
})
sensors.color3.onColorDetected(ColorSensorColor.Green, function () {
    brick.setStatusLight(StatusLight.Green)
})
sensors.color3.onColorDetected(ColorSensorColor.Yellow, function () {
    brick.setStatusLight(StatusLight.Orange)
})
brick.showString("What color?", 0)
```

## Step 6

Open the Music Toolbox drawer.  Drag out 3 Play Sound Effect blocks onto the Workspace, and drop one of them each into the On Color Detected blocks after the Set Status Light block.

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Red, function () {
    brick.setStatusLight(StatusLight.Red)
    music.playSoundEffect(sounds.animalsCatPurr)
})
sensors.color3.onColorDetected(ColorSensorColor.Green, function () {
    brick.setStatusLight(StatusLight.Green)
    music.playSoundEffect(sounds.animalsCatPurr)
})
sensors.color3.onColorDetected(ColorSensorColor.Yellow, function () {
    brick.setStatusLight(StatusLight.Orange)
    music.playSoundEffect(sounds.animalsCatPurr)
})
brick.showString("What color?", 0)
```

## Step 7

In the Play Sound Effect blocks, use the drop-down menu to select the “Colors Red”, “Colors Green”, and “Colors Yellow” sound effects corresponding to the different colors detected. 

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Red, function () {
    brick.setStatusLight(StatusLight.Red)
    music.playSoundEffect(sounds.colorsRed)
})
sensors.color3.onColorDetected(ColorSensorColor.Green, function () {
    brick.setStatusLight(StatusLight.Green)
    music.playSoundEffect(sounds.colorsGreen)
})
sensors.color3.onColorDetected(ColorSensorColor.Yellow, function () {
    brick.setStatusLight(StatusLight.Orange)
    music.playSoundEffect(sounds.colorsYellow)
})
brick.showString("What color?", 0)
```

## Step 8

Now, let’s download our program to the brick. Plug your @boardname@ into the computer with the USB cable, and click the blue **Download** button in the bottom left of your screen.  Follow the directions to save your program to the brick. Attach a Color Sensor to Port 3 of your brick. Test your program by flashing Red, Green and Yellow colored paper or LEGO bricks in front of the Color Sensor.
