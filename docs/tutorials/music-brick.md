# Music Brick

## Introduction @unplugged

Transform your @boardname@ into a musical instrument!

![Press my buttons message](/static/tutorials/music-brick/press-my-buttons.png)


## Step 1

Open the ``||brick:Brick||`` Toolbox drawer. From the **Screen** section, drag out a ``||brick:show string||`` block onto the Workspace, and drop it into the ``||loops:on start||`` block. You should hear and see the block click into place.

```blocks
brick.showString("Hello world", 1)
```

## Step 2

In the ``||brick:show string||`` block, type the text ``"Press my buttons!"`` to replace ``"Hello world"``.

```blocks
brick.showString("Press my buttons!", 1)
```

## Step 3

Open the ``||brick:Brick||`` Toolbox drawer. From the **Buttons** section, drag out an ``||brick:on button||`` block anywhere onto the Workspace.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {

})
brick.showString("Press my buttons!", 1)
```

## Step 4

Open the ``||music:Music||`` Toolbox drawer. Drag out **5** ``||music:play tone||`` blocks onto the Workspace, and drop them into the ``||brick:on button||`` block. **Note:** you can also right-click on a block and select "Duplicate" to copy blocks.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    music.playTone(262, music.beat(BeatFraction.Half))
    music.playTone(262, music.beat(BeatFraction.Half))
    music.playTone(262, music.beat(BeatFraction.Half))
    music.playTone(262, music.beat(BeatFraction.Half))
    music.playTone(262, music.beat(BeatFraction.Half))
})
brick.showString("Press my buttons!", 1)
```

## Step 5

In the ``||music:play tone||`` blocks, use the drop-down menu to select a note to play for each block.  You can also set the duration to play each note for.

![Tone selector keyboard](/static/tutorials/music-brick/play-tone-dropdown.png)

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    music.playTone(440, music.beat(BeatFraction.Half))
    music.playTone(494, music.beat(BeatFraction.Half))
    music.playTone(392, music.beat(BeatFraction.Half))
    music.playTone(196, music.beat(BeatFraction.Half))
    music.playTone(294, music.beat(BeatFraction.Whole))
})
brick.showString("Press my buttons!", 1)
```

## Step 6

Now, plug your EV3 Brick into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the EV3 Brick.

You can add more ``||brick:on button||`` blocks to the Workspace and create other ``||music:play tone||`` melodies when different buttons are pressed to transform your brick into a musical instrument!
 