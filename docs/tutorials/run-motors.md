# Run motors

## Introduction @fullscreen

Use the buttons to start and stop running motors 
 
![Motors in simulator running](/static/tutorials/run-motors/run-mttors.gif)

## Step 1

Open the ``||brick:Brick||`` Toolbox drawer. From the **Buttons** section, drag out **2** ``||brick:on button||`` blocks onto the Workspace (you can place these anywhere on the Workspace).

## Step 2

In the ``||brick:on button||`` blocks, use the drop-down menu to select the ``up`` and ``down`` buttons.
 
![Button dropdown selection](/static/tutorials/run-motors/on-button-dropdown.png)

```block
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {

})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {

})
```

## Step 3

Open the ``||motors:Motors||`` Toolbox drawer. Drag out **2** Run blocks onto the Workspace, and drop one of them each into the ``||brick:on button||`` blocks.

```block
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
```

## Step 4

The Run blocks specify which type of motor to run (Large or Medium), and which port the motor is attached to (Ports A, B, C, or D). The default setting is to run the large motor attached to port A at 50% speed.  When we press the Down button, we want our motor to run in the reverse direction.

In the Run block that is in the On Button Down pressed block, change the speed value from ``50%`` to ``-50%``. 
 
![Motor speed select field](/static/tutorials/run-motors/runs-peed-field.png)

```block
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(-50)
})
```

## Step 5

Now, let’s add a Medium motor, and specify how many rotations we want the motor to run for. 
Open the Brick Toolbox drawer.  From the Buttons section, drag out 2 On Button blocks onto the Workspace.  In the On Button blocks, use the drop-down menu to select the left and right buttons.

```block
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(-50)
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {

})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {

}
```

## Step 6

Open the Motors Toolbox drawer. Drag out 2 Run blocks onto the Workspace, and drop one of them each into the On Button left and right blocks.

```block
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

In the Run blocks that are in the On Button left and right blocks, use the drop-down menu to select ``Medium Motor D``. 
 
![Select motor on a port dropdown](/static/tutorials/run-motors/run-motor-dropdown.png)

```block
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

In the Run Medium motor blocks, click on the plus icon (+) to expand the blocks.  Change the number of rotations from 0 to 5.

```block
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

Now let’s also change the speed that our Medium motors are running at.  In the Run Medium motor block that is in the On Button left block, change the speed from 50% to 10%.

```block
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

In the Run Medium motor block that is in the ``||brick:on button right||`` block, change the speed from ``50%`` to ``100%``.

```block
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

Finally, let’s add a way to stop all our motors from running.  Open the Brick Toolbox drawer.  From the Buttons section, drag out an On Button block onto the Workspace.

```block
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

# Step 12

Open the ``||motors:Motors||`` Toolbox drawer. Drag out a ``||motors:stop all motors||`` block onto the Workspace, and drop into the On Button enter block.

```block
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

Now, let’s download our program to the brick. Plug your EV3 brick into the computer with the USB cable, and click the blue **Download** button in the bottom left of your screen.  Follow the directions to save your program to the brick. Attach a Large motor to Port A, and a Medium motor to Port D. Then test your program by pressing the different buttons to see whether the correct motors are running as expected.
