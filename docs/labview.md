# Coding in MakeCode

This guide helps users who are used to working with @boardname@ become familiar with using blocks in MakeCode.

## Snap together the blocks

Just like in LabView, blocks in the MakeCode editor can be dragged from the cabinet and snapped together
to create a sequence of program instructions.

Take a look a the LabView program below: it **starts**, turns on motor A, waits a second, and finally stops motor A.

![sequence of block](/static/labview/sequencing.png)     

The blocks in MakeCode have similar functions and go together in the same way: they snap into the ``||loops:on start||`` block and then connect to each other vertically.

```blocks
motors.largeA.run(50)
pause(1000)
motors.largeA.stop()
```

Any block program can be converted to JavaScript and you can edit it as lines of code too.

```typescript
motors.largeA.run(50)
pause(1000)
motors.largeA.stop()
```

## Download to the EV3

Before you actually run your program on the EV3 Brick, you can first try it in the simulator. The MakeCode editor includes a simulator in the browser for you to test your code. You can make changes to your program and check them out it the simulator to make sure your code works the way want. The similator knows when you modify your code and it restarts automatically to run the new code.

Once you're ready to transfer your program to the EV3 Brick, click the ``|Download|`` button and follow the instructions.

## Single motors

This program controls a large motor on port A in several different ways. It sets just the speed and then sets speed for: an amount of time, angle of movement, and a number of rotations.

![Single motor blocks](/static/labview/motors.png)       

```blocks
motors.largeA.run(50);
motors.largeA.run(50, 1000, MoveUnit.MilliSeconds);
motors.largeA.run(50, 360, MoveUnit.Degrees);
motors.largeA.run(50, 1, MoveUnit.Rotations);
motors.largeA.stop();
```

## Steering

The **steering** blocks let you to synchronize two motors at a precise rate. They can also specify the duration, angle, or number of rotations for the motors to turn.

![Steering blocks](/static/labview/steer.png)

```blocks
motors.largeBC.steer(0, 50);
motors.largeBC.steer(0, 50, 1000, MoveUnit.MilliSeconds);
motors.largeBC.steer(0, 50, 360, MoveUnit.Degrees);
motors.largeBC.steer(0, 50, 1, MoveUnit.Rotations);
motors.largeBC.stop();
```

### ~ hint

The **turn ratio range is -200, 200** unlike LabView who used -100,100.

### ~

## Tank

The **tank** blocks control the speed of two motors. These are commonly used for a differential drive robot. The blocks can also specify the duration, angle, or number of rotations.

![Tank block](/static/labview/tank.png)

```blocks
motors.largeBC.tank(50, 50);
motors.largeBC.tank(50, 50, 1000, MoveUnit.MilliSeconds);
motors.largeBC.tank(50, 50, 360, MoveUnit.Degrees);
motors.largeBC.tank(50, 50, 1, MoveUnit.Rotations);
motors.largeBC.stop();
```

## Coasting and braking

By default, all motors coast when any command used to move finishes. You can keep them from coasting with the ``||motors:set brake||`` block. 

![Brake block](/static/labview/brake.png)

```blocks
motors.largeD.setBrake(true);
motors.largeD.run(50, 1, MoveUnit.Rotations)
```

## Inverting and regulating motors

If you wan to change the direction that a motor turns, use the ``||motors:set inverted||`` block.

![Brake block](/static/labview/invertmotor.png)

```blocks
motors.largeA.setInverted(true);
```

By default, the speed of motors is regulated. This means that if your robot goes up a hill,
the regulator will adjust the power to match the desired speed. You can disable this feature
using ``||motors:set regulated||``.

![Brake block](/static/labview/unregulatedmotor.png)

```blocks
motors.largeA.setRegulated(false);
```

## Brick

The **Brick** category has a number of blocks to display graphics on the brick screen.

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

It is quite common to have to wait for a task to finish or for a sensor state to change, such as when a touch button pressed. The ``||loops:pause||`` and ``||sensors:pause until||`` blocks provide a way for your program to wait for a period of time.

![pause for time](/static/labview/pausefortime.png)      

```blocks
motors.largeD.run(50)
pause(1000)
motors.largeD.stop();
```

![pause for touch](/static/labview/pausefortouch.png)

```blocks
motors.largeD.run(50)
sensors.touch1.pauseUntil(ButtonEvent.Pressed)
motors.largeD.stop();
```

![pause for distance](/static/labview/pausefordistance.png)

```blocks
motors.largeD.run(50)
sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectNear)
motors.largeD.stop();
```

You can also use the ``||loops:pause until||`` block to wait on any [boolean](/types/boolean) expression. As your program runs, it waits until the condition (expression) inside becomes true.

```blocks
motors.largeD.run(50)
pauseUntil(() => sensors.touch1.isPressed())
motors.largeD.stop()
```

## Loops

![Single loop](/static/labview/loopinfinite.png)

```blocks
forever(() => {
    motors.largeD.run(50, 1, MoveUnit.Rotations);
    motors.largeD.run(-50, 1, MoveUnit.Rotations);
})
```

![While loop](/static/labview/while.png)

```blocks
for(let i = 0; i < 10; i++) {
    motors.largeD.run(50, 1, MoveUnit.Rotations);
    motors.largeD.run(-50, 1, MoveUnit.Rotations);
}
let k = 0;
while(k < 10) {
    motors.largeD.run(50, 1, MoveUnit.Rotations);
    motors.largeD.run(-50, 1, MoveUnit.Rotations);    
    k++;
}
```

## Variables

![Variable block](/static/labview/speedoflightvar.png)

```blocks
let light = 0;
forever(function () {
    light = sensors.color3.light(LightIntensityMode.Reflected);
    motors.largeD.run(light)
})
```

## Concurrent loops

You can start up multiple ``||loops:forever||`` loops that run at the same time. Actually, only the code in just one of the loops is really running at any exact moment in time. Each loop, though, gets a turn to run all of its code and this makes them run [_concurrently_](https://en.wikipedia.org/wiki/Concurrent_computing).

![Multiple loops running at the same time](/static/labview/multipleloops.png)

```blocks
forever(() => {
    motors.largeD.run(50, 1, MoveUnit.Rotations);
    motors.largeD.run(-50, 1, MoveUnit.Rotations);
})
forever(() => {
    brick.showImage(images.eyesMiddleRight)
    pause(1000)
    brick.showImage(images.eyesMiddleLeft)
    pause(1000)
})
```

## Conditional

The ``||logic:if||`` block allows you to run different code depending on whether some condition ([boolean](/types/boolean) expression) is `true` or `false`. Also, this is similar to the ``||loops:switch||`` block.

![Brake block](/static/labview/ife.png)

```blocks
forever(function() {
    if(sensors.touch1.isPressed()) {
        motors.largeD.run(50)
    } else {
        motors.largeD.stop()
    }
})
```

## Random

The ``||math:pick random||`` block returns a random number selected from a range of numbers.

![Brake block](/static/labview/random.png)

```blocks
forever(function () {
    motors.largeBC.steer(Math.randomRange(-5, 5), 50)
    pause(100)
})
```