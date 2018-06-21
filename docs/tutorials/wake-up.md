# Wake Up!

## Introduction @unplugged

Show different moods on your @boardname@.

![Show mood on the screen](/static/tutorials/wake-up/show-mood.gif)

## Step 1 @fullscreen

Open the ``||brick:Brick||`` Toolbox drawer. Drag out a ``||brick:show mood||`` block onto the Workspace, and place it into the ``||loops:on start||`` block. You should hear and see the block click into place. 

```blocks
brick.showMood(moods.sleeping)
```

## Step 2

Notice your EV3 Brick is snoring with eyes closed in the simulator! Let’s wake it up. Open the ``||brick:Brick||`` Toolbox drawer again. Drag out **2** more ``||brick:show mood||`` blocks and drop them into the ``||brick:on start||`` block also.

```blocks
brick.showMood(moods.sleeping) 
brick.showMood(moods.sleeping) 
brick.showMood(moods.sleeping) 
```

## Step 3

In the second ``||brick:show mood||`` block, click on the drop-down menu to select the tired mood.
 
![Show mood dropdown selections](/static/tutorials/wake-up/show-mood-dropdown-1.png)

```blocks
brick.showMood(moods.sleeping) 
brick.showMood(moods.tired) 
brick.showMood(moods.sleeping) 
```

## Step 4

In the third ``||brick:show mood||`` block, click on the drop-down menu to select the love mood.  
 
![Show mood dropdown selections](/static/tutorials/wake-up/show-mood-dropdown-2.png)

```blocks
brick.showMood(moods.sleeping) 
brick.showMood(moods.tired) 
brick.showMood(moods.love)
```

## Step 5

Now, plug your EV3 Brick into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the brick.
 