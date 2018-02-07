# Coding in MakeCode

This guide is intended for users who are used to the LabView LEGO Minstorms editor.

## Snap the blocks

Just like LabView, blocks can be dragged from the cabinet and snapped together
to create a sequence of program instructions.

The program below **starts**, turns on motor A, waits a second and stop motor A.

![sequence of block](/static/labview/sequencing.png)     

The blocks are similar: they snap on the ``||on start||`` block then latch to each other vertically.

```blocks
motors.largeA.setSpeed(50)
loops.pause(1000)
motors.largeA.stop()
```

All block programs can be converted to JavaScript and edited from there as well.

```typescript
motors.largeA.setSpeed(50)
loops.pause(1000)
motors.largeA.stop()
```

## Download to the EV3

The MakeCode editor provides a simulator to try out the code in your browser. It restarts automatically after you make a code change. Once you are ready to transfer it to the @boardname@, click the ``||Download||`` button and follow the instructions.

## Single motors

The program below controls a large motor on port A in a variety of ways: setting the speed, 
setting the speed for a given time, angle or number of rotations.

![Single motor blocks](/static/labview/motors.png)       

```blocks
motors.largeA.setSpeed(50);
motors.largeA.setSpeed(50, 1000, MoveUnit.MilliSeconds);
motors.largeA.setSpeed(50, 360, MoveUnit.Degrees);
motors.largeA.setSpeed(50, 1, MoveUnit.Rotations);
motors.largeA.stop();
```

## Steering

The **steering** blocks allow to synchronize two motors at a precise rate. They can also specify the duration, angle or number of rotations.

![Steering blocks](/static/labview/steer.png)

```blocks
motors.largeBC.steer(0, 50);
motors.largeBC.steer(0, 50, 1000, MoveUnit.MilliSeconds);
motors.largeBC.steer(0, 50, 360, MoveUnit.Degrees);
motors.largeBC.steer(0, 50, 1, MoveUnit.Rotations);
motors.largeBC.stop();
```

## Tank

The **tank** blocks control the speed of two motors, typically from a differential drive robot. They can also specify the duration, angle or number of rotations.

![Tank block](/static/labview/tank.png)

```blocks
motors.largeBC.tank(50, 50);
motors.largeBC.tank(50, 50, 1000, MoveUnit.MilliSeconds);
motors.largeBC.tank(50, 50, 360, MoveUnit.Degrees);
motors.largeBC.tank(50, 50, 1, MoveUnit.Rotations);
motors.largeBC.stop();
```

## Coasting and braking

By default, all motors coast when the move command is done. You can change this behavior with the `set brake`` block. 

![Brake block](/static/labview/brake.png)

```blocks
motors.largeD.setBrake(true);
motors.largeD.setSpeed(50, 1, MoveUnit.Rotations)
```

## Inverting and regulating motors

Sometime you need to invert the direction of a motor. Use the ``set invert`` block.

![Brake block](/static/labview/invertmotor.png)

```blocks
motors.largeA.setInverted(true);
```

By default, the speed of motors is regulated. This means that if your robot goes up a hill,
the regulator will adjust the power to match the desired speed. You can disable this feature
using ``set regulated``.

![Brake block](/static/labview/unregulatedmotor.png)

```blocks
motors.largeA.setRegulated(false);
```

## Brick

The brick category contains a number of blocks to display graphics on the brick screen.

![brick image](/static/labview/brickimage.png)

```blocks
brick.clearScreen()
brick.showImage(images.expressionsWink)
```

![brick status light](/static/labview/brickstatuslight.png)

```blocks
brick.setStatusLight(StatusLight.Off);
brick.setStatusLight(StatusLight.Red);
brick.setStatusLight(StatusLight.OrangePulse);
```

## Waiting (pausing)

It is quite common to wait for a sensor state, such as a touch button pressed.
The ``pause until`` blocks provide a variety of ways to acheive this.

![pause for time](/static/labview/pausefortime.png)      

```blocks
motors.largeD.setSpeed(50)
loops.pause(1000)
motors.largeD.stop();
```

![pause for touch](/static/labview/pausefortouch.png)

```blocks
motors.largeD.setSpeed(50)
sensors.touch1.pauseUntil(ButtonEvent.Pressed)
motors.largeD.stop();
```

![pause for distance](/static/labview/pausefordistance.png)

```blocks
motors.largeD.setSpeed(50)
sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear)
motors.largeD.stop();
```

You can also use the ``pause until`` block to wait on any boolean expression.
The runtime will evaluate this expression until it becomes true.

```blocks
motors.largeD.setSpeed(50)
pauseUntil(() => sensors.touch1.isPressed())
motors.largeD.stop()
```

## Loops

![Single loop](/static/labview/loopinfinite.png)

```blocks
loops.forever(() => {
    motors.largeD.setSpeed(50, 1, MoveUnit.Rotations);
    motors.largeD.setSpeed(-50, 1, MoveUnit.Rotations);
})
```

![While loop](/static/labview/while.png)

```blocks
for(let i = 0; i < 10; i++) {
    motors.largeD.setSpeed(50, 1, MoveUnit.Rotations);
    motors.largeD.setSpeed(-50, 1, MoveUnit.Rotations);
}
let k = 0;
while(k < 10) {
    motors.largeD.setSpeed(50, 1, MoveUnit.Rotations);
    motors.largeD.setSpeed(-50, 1, MoveUnit.Rotations);    
    k++;
}
```

## Variables

![Variable block](/static/labview/speedoflightvar.png)

```blocks
let light = 0;
loops.forever(function () {
    light = sensors.color3.light(LightIntensityMode.Reflected);
    motors.largeD.setSpeed(light)
})
```

## Concurrent loops

You can spin up multiple ``forever`` loops that will run at the same time.
Only one code is running at the time, but each loop iteration will interleave.

![Brake block](/static/labview/multipleloops.png)

```blocks
loops.forever(() => {
    motors.largeD.setSpeed(50, 1, MoveUnit.Rotations);
    motors.largeD.setSpeed(-50, 1, MoveUnit.Rotations);
})
loops.forever(() => {
    brick.showImage(images.eyesMiddleRight)
    loops.pause(1000)
    brick.showImage(images.eyesMiddleLeft)
    loops.pause(1000)
})
```

## Conditional

The ``if`` block allow to run different code based on a boolean condition.
This is similar to the switch block.

![Brake block](/static/labview/ife.png)

```blocks
loops.forever(function() {
    if(sensors.touch1.isPressed()) {
        motors.largeD.setSpeed(50)
    } else {
        motors.largeD.stop()
    }
})
```

## Random

The ``random range`` blocks returns number between two bounds.

![Brake block](/static/labview/random.png)

```blocks
loops.forever(function () {
    motors.largeBC.steer(Math.randomRange(-5, 5), 50)
    loops.pause(100)
})
```