# What Color is it?

## Introduction @unplugged

Use the Color Sensor to detect different colors.

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

Open the ``||sensors:Sensors||`` Toolbox drawer. Drag out **3** ``||sensors:on color sensor detected||`` blocks anywhere onto the Workspace.

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Blue, function () {

})
sensors.color3.onColorDetected(ColorSensorColor.Blue, function () {

})
sensors.color3.onColorDetected(ColorSensorColor.Blue, function () {

})
```

## Step 4

In the ``||sensors:on color sensor detected||`` blocks, use the second drop-down menu to select Red, Green, and Yellow colors. 

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Red, function () {

})
sensors.color3.onColorDetected(ColorSensorColor.Green, function () {

})
sensors.color3.onColorDetected(ColorSensorColor.Yellow, function () {

})
brick.showString("What color?", 1)
```

## Step 5

Open the ``||brick:Brick||`` Toolbox drawer. From the **Buttons** section, drag out **3** ``||brick:set status light||`` blocks and drop one of them each into the ``||sensors:on color sensor detected||`` blocks.

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
brick.showString("What color?", 1)
```

## Step 6

In the ``||brick:set status light||`` blocks, use the drop-down menu to change the lights to Red, Green, and Orange corresponding to the different colors detected. There is no Yellow status light, so we’ll use Orange instead.

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
brick.showString("What color?", 1)
```

## Step 7

Open the ``||music:Music||`` Toolbox drawer. Drag out **3** ``||music:play sound effect||`` blocks and drop one of them each into the ``||sensors:on color sensor detected||`` blocks after the ``||brick:set status light||`` block.

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
brick.showString("What color?", 1)
```

## Step 8

In the ``||music:play sound effect||`` blocks, use the drop-down menu to select the ``colors red``, ``colors green``, and ``colors yellow`` sound effects corresponding to the different colors detected. 

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
brick.showString("What color?", 1)
```

## Step 9

Now, plug your EV3 Brick into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the EV3 Brick.

Attach a Color Sensor to Port 3 of your EV3 Brick. Test your program by flashing Red, Green and Yellow colored paper or use LEGO bricks in front of the Color Sensor.
