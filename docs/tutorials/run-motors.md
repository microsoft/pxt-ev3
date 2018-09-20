# Run motors

## Introduction @unplugged

Use the buttons to start and stop the Large Motor and Medium Motor.
 
![Motors in simulator running](/static/tutorials/run-motors/run-motors.gif)

## Step 1

Open the ``||brick:Brick||`` Toolbox drawer. Drag out **2** ``||brick:on button||`` blocks anywhere onto the Workspace.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {

})
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {

})
```

## Step 2

In the ``||brick:on button||`` blocks, use the drop-down menu to select the ``up`` and ``down`` buttons.
 
![Button dropdown selection](/static/tutorials/run-motors/on-button-dropdown.png)

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {

})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {

})
```

## Step 3

Open the ``||motors:Motors||`` Toolbox drawer. Drag out **2** ``||motors:run||`` blocks onto the Workspace, and drop one of them each into the ``||brick:on button||`` blocks.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
```

## Step 4

The ``||motors:run||`` blocks specify which type of motor to run (Large Motor or Medium Motor), and which port the motor is attached to (Ports A, B, C, or D). The default setting is to run the Large Motor attached to Port A at 50% speed.

When we press the ``down`` button, we want our motor to run in the reverse direction. In the ``||motors:run||`` block that is in the ``||brick:on button down pressed||`` block, change the speed value from ``50%`` to ``-50%``. 
 
![Motor speed select field](/static/tutorials/run-motors/run-speed-field.png)

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(-50)
})
```

## Step 5

Open the ``||brick:Brick||`` Toolbox drawer and drag out **2** ``|brick:on button||`` blocks. In the ``||brick:on button||`` blocks, use the drop-down menu to select the ``left`` and ``right`` buttons.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(-50)
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {

})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {

})
```

## Step 6

Open the ``||motors:Motors||`` Toolbox drawer. Drag out **2** ``||motors:run||`` blocks onto the Workspace, and drop one of them each into the ``||brick:on button left||`` and ``||brick:on button right||`` blocks.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(-50)
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
```

## Step 7

For the ``||motors:run||`` blocks that are in the ``||brick:on button left||`` and ``||brick:on button right||`` blocks, use the drop-down menu to select a ``medium motor`` on Port ``D``. 

![Select a motor type dropdown](/static/tutorials/run-motors/run-motor-dropdown.png)
<br/>
![Select a motor port dropdown](/static/tutorials/run-motors/motor-port-dropdown.png)

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(-50)
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    motors.mediumD.run(50)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    motors.mediumD.run(50)
})
```

## Step 8

In the ``||motors:run medium motor||`` blocks, click on the plus icon **(+)** to expand the blocks. Change the number of rotations from `0` to `5`.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(-50)
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    motors.mediumD.run(50, 5, MoveUnit.Rotations)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    motors.mediumD.run(50, 5, MoveUnit.Rotations)
})
```

## Step 9

Let’s also change the speed that our Medium Motor is running at. In the ``||motors:run medium motor||`` block that is in the ``||brick:on button left||`` block, change the speed from ``50%`` to ``10%``.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(-50)
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    motors.mediumD.run(10, 5, MoveUnit.Rotations)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    motors.mediumD.run(50, 5, MoveUnit.Rotations)
})
```

## Step 10

In the ``||motors:run medium motor||`` block that is in the ``||brick:on button right||`` block, change the speed from ``50%`` to ``100%``.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(-50)
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    motors.mediumD.run(10, 5, MoveUnit.Rotations)
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    motors.mediumD.run(100, 5, MoveUnit.Rotations)
})
```

## Step 11

Finally, let’s add a way to stop all our motors from running. Open the ``||brick:Brick||`` Toolbox drawer. Drag out an ``||brick:on button||`` block onto the Workspace.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () { 
    motors.largeA.run(50) 
}) 
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () { 
    motors.largeA.run(-50) 
}) 
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () { 
    motors.mediumD.run(10, 5, MoveUnit.Rotations) 
}) 
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () { 
    motors.mediumD.run(100, 5, MoveUnit.Rotations) 
}) 
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () { 
     
})
```

## Step 12

Open the ``||motors:Motors||`` Toolbox drawer. Drag out a ``||motors:stop all motors||`` block onto the Workspace, and drop it into the ``||brick:on button enter||`` block.

```blocks
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () { 
    motors.largeA.run(50) 
}) 
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () { 
    motors.largeA.run(-50) 
}) 
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () { 
    motors.mediumD.run(10, 5, MoveUnit.Rotations) 
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () { 
    motors.mediumD.run(100, 5, MoveUnit.Rotations) 
}) 
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () { 
    motors.stopAll() 
}) 
```

## Step 13

Now, plug your EV3 Brick into the computer with the USB cable, and click the **Download** button at the bottom of your screen. Follow the directions to save your program to the EV3 Brick.

Attach a Large Motor to Port A, and a Medium Motor to Port D. Test your program by pressing the different buttons to see whether the correct motors are running as expected.
