# Touch to Run

## Introduction @unplugged

Use the Touch Sensor to run a motor.

![Large motor connected to brick](/static/tutorials/touch-to-run/touch-to-run.gif)

## Step 1

Open the ``||sensors:Sensors||`` Toolbox drawer. Drag out **2** ``||sensors:on touch||`` blocks anywhere onto the Workspace.

```blocks
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {

})
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {

})
```

## Step 2

In one of the ``||sensors:on touch||`` blocks, use the second drop-down menu to change from ``pressed`` to ``released``.
 
![Touch sensor action dropdown](/static/tutorials/touch-to-run/on-touch-dropdown.png)

```blocks
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {

})
sensors.touch1.onEvent(ButtonEvent.Released, function () {

})
```

## Step 3

Open the ``||motors:Motors||`` Toolbox drawer. Drag out a ``||motors:run||`` block onto the Workspace, and drop it into the ``||sensors:on touch pressed||`` block.

```blocks
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
sensors.touch1.onEvent(ButtonEvent.Released, function () {

})
```

## Step 4

Open the ``||motors:Motors||`` Toolbox drawer. Drag out a ``||motors:stop||`` block onto the Workspace, and drop it into the ``||sensors:on touch released||`` block.

```blocks
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
sensors.touch1.onEvent(ButtonEvent.Released, function () {
    motors.largeA.stop()
})
```

## Step 5

Now, plug your EV3 Brick into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the EV3 Brick.

Attach a Large Motor to Port A, and a Touch Sensor to Port 1 on your EV3 Brick. Test your program by pressing and releasing the touch sensor – does the motor start and stop as expected?
