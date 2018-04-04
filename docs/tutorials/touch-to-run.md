# Touch to Run

## Introduction

Use the Touch sensor to run a motor.

![Large motor connected to brick](/static/tutorials/touch-to-run/touch-to-run.gif)

Open the ``||sensor:Sensors||`` Toolbox drawer. From the **Touch** Sensor section, drag out 2 ``||senosrs:on touch||`` blocks onto the Workspace (you can place these anywhere). 
 
In one of the On Touch blocks, use the second drop-down menu to change from “pressed” to “released”. 
 
![](/static/tutorials/touch-to-run/on-touch-dropdown.png)

```block
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {

})
sensors.touch1.onEvent(ButtonEvent.Released, function () {

})
```

## Step 3

Open the ``||motors:Motors||`` Toolbox drawer. Drag out a ``||motors:run||`` block onto the Workspace, and drop it into the ``||brick:on touch Pressed block.

```block
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
sensors.touch1.onEvent(ButtonEvent.Released, function () {

})
```

## Step 4

Open the Motors Toolbox drawer. Drag out a Stop block onto the Workspace, and drop it into the On Touch Released block.

```block
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    motors.largeA.run(50)
})
sensors.touch1.onEvent(ButtonEvent.Released, function () {
    motors.largeA.stop()
})
```

## Step 5

Now, let’s download our program to the brick. Plug your EV3 brick into the computer with the USB cable, and click the blue **Download** button in the bottom left of your screen.  Follow the directions to save your program to the brick. Attach a Large motor to Port A, and a Touch sensor to Port 1 on your brick. Test your program by pressing and releasing the touch sensor – does the motor start and stop as expected?
