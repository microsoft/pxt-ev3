# What Animal Am I?

## Introduction @fullscreen

Create different animal effects with your LEGO Mindstorms Brick.

![Guess the what the animal is](/static/tutorials/what-animal-am-i/guess-animal.gif)

## Step 1

Open the ``||brick:Brick||`` Toolbox drawer. Drag out a ``||brick:show string||`` block from the **Screen** section onto the Workspace, and drop it into the ``||loops:on start||`` block. You should hear and see the block click into place.

```block
brick.showString("Hello world", 1)
```

## Step 2

In the ``||brick:show string||`` block, type the text ``"Guess what animal?"`` to replace ``"Hello world"``.

```block
brick.showString("Guess what animal?", 1)
```

## Step 3

Open the ``||brick:Brick||`` Toolbox drawer. From the **Buttons** section, drag out an ``||brick:on button||`` block and put it anywhere in the Workspace.

```block
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () { 
     
}) 
brick.showString("Guess what animal?", 1)
```

## Step 4

In the ``||brick:on button||`` block, use the drop-down menu to select the ``left`` button. 
 
![Dropdown with button choices](/static/tutorials/what-animal-am-i/on-button-dropdown.png)

```block
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () { 
     
}) 
brick.showString("Guess what animal?", 1) 
```

## Step 5

Open the ``||brick:Brick||`` Toolbox drawer. In the **Buttons** section, drag out **3** more ``||brick:on button||`` blocks onto the Workspace. Using the drop-down menu, select the ``right``, ``up``, and ``down`` buttons for these 3 blocks.

```block
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () { 
     
}) 
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () { 
     
}) 
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () { 
     
}) 
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () { 
     
}) 
brick.showString("Guess what animal?", 1) 
```

## Step 6

Open the ``||brick:Brick||`` Toolbox drawer. Drag out **4** ``||brick:show image||`` blocks onto the Workspace, and drop one of them into each of the ``||brick:on button||`` blocks.

```block
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () { 
    brick.showImage(images.expressionsBigSmile) 
}) 
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () { 
    brick.showImage(images.expressionsBigSmile) 
}) 
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () { 
    brick.showImage(images.expressionsBigSmile) 
}) 
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () { 
    brick.showImage(images.expressionsBigSmile) 
}) 
brick.showString("Guess what animal?", 0)
```

## Step 7

In the ``||brick:show image||`` blocks, use the drop-down menu to select a different image to show for each block. 
 
![Dropdown with image selection](/static/tutorials/what-animal-am-i/show-image-dropdown.png)

```block
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.expressionsMouth2shut)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.expressionsMouth1open)
})
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.objectsBoom)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.objectsPirate)
})
brick.showString("Guess what animal?", 0)
```

## Step 8

Open the ``||music:Music||`` Toolbox drawer. Drag out **4** ``||music:play sound effect||`` blocks onto the Workspace, and drop one of them into each of the ``||brick:on button||`` blocks, just after the ``||brick:show image||`` block.

```block
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.expressionsMouth2shut)
    music.playSoundEffect(sounds.animalsCatPurr)
}) 
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.expressionsMouth1open)
    music.playSoundEffect(sounds.animalsCatPurr)
})
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.objectsBoom)
    music.playSoundEffect(sounds.animalsCatPurr)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.objectsPirate)
    music.playSoundEffect(sounds.animalsCatPurr)
})
brick.showString("Guess what animal?", 0)
```

## Step 9

In each ``||music:play sound effect||`` block, use the drop-down menu to select a different animal sound to play.
 
![Dropdown with sound effect selection](/static/tutorials/what-animal-am-i/play-sound-effect-dropdown.png)

```block
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.expressionsMouth2shut)
    music.playSoundEffect(sounds.animalsCatPurr)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.expressionsMouth1open)
    music.playSoundEffect(sounds.animalsDogBark1)
})
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.objectsBoom)
    music.playSoundEffect(sounds.animalsElephantCall)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.objectsPirate)
    music.playSoundEffect(sounds.animalsSnakeHiss)
})
brick.showString("Guess what animal?", 0)
```

## Step 10

Now, let’s download our program to the brick. Plug your EV3 brick into the computer with the USB cable, and click the blue **Download** button in the bottom left of your screen. Follow the directions to save your program to the brick. Test your program with a friend by pressing the right, left, up, and down buttons on your Brick. Have your friend guess what animal it is!
