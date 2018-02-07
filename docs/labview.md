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

![Brake block](/static/labview/brake.png)
![Brake block](/static/labview/unregulatedmotor.png)
![Brake block](/static/labview/invertmotor.png)

![Brake block](/static/labview/lighttospeed.png)
![Brake block](/static/labview/multipleloops.png)
![Brake block](/static/labview/pausefortouch.png)
![Brake block](/static/labview/speedoflight.png)
![Brake block](/static/labview/brickimage.png)
![Brake block](/static/labview/ife.png)
![Brake block](/static/labview/loopinfinite.png)
![Brake block](/static/labview/pausefordistance.png)
![Brake block](/static/labview/random.png)
![Brake block](/static/labview/speedoflightvar.png)
![Brake block](/static/labview/brickstatuslight.png)
![Brake block](/static/labview/pausefortime.png)      
![Brake block](/static/labview/while.png)