# Make a custom animation

## Introduction @fullscreen

Create a custom animation for your @boardname@.
 
![Button press on brick](/static/tutorials/make-an-animation/button-pressed.gif)

## Step 1

Open the ``||brick:Brick||`` Toolbox drawer. Drag out a ``||brick:show string||`` block onto the Workspace, and drop it into the ``||loops:on Start||`` block. You should hear and see the block click into place.

```block
brick.showString("Hello world", 1) 
```

## Step 2

In the ``||brick:show string||`` block, type the text ``"Press my button"`` to replace ``"Hello world"``. 

```blocks
brick.showString("Press my button!", 1) 
```

## Step 3

Open the ``||brick:Brick||`` Toolbox drawer. Drag out an ``||brick:on button||`` block onto anyplace in the Workspace.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () { 
     
}) 
brick.showString("Press my button!", 1) 
```

## Step 4

Open the ``||brick:Brick||`` Toolbox drawer. Drag out a ``||brick:show image||`` block onto the Workspace, and drop it into the ``||brick:on button||`` block.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () { 
    brick.showImage(images.expressionsBigSmile) 
}) 
brick.showString("Press my button!", 1) 
```

## Step 5

Open the ``||brick:Brick||`` Toolbox drawer. Drag out a ``||brick:set status light||`` block onto the Workspace, and drop it into the ``||brick:on button||`` block after the ``||brick:show image||`` block.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () { 
    brick.showImage(images.expressionsBigSmile) 
    brick.setStatusLight(StatusLight.Orange) 
}) 
brick.showString("Press my button!", 1) 
```

## Step 6

Now, plug your EV3 Brick into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the brick.
