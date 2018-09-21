# Make a Sound Machine

Make a Sound Machine that can play a rhythm, music or just noise!

![Maker – Make a Sound Machine Main Image](/static/lessons/make-a-sound-machine/lego-maker-sound-machine-1.jpg)

## Connect 

Music is made up of a combination of sounds, notes and rhythm. A rhythm is a regular movement or repeated pattern of movements that can be used in many different ways. In mechanical machines, a rhythm can help keep a machine running smoothly. It can also be used to generate different sounds in music. 

![Sound Machine 3 Stock Footage Images](/static/lessons/make-a-sound-machine/three-stock.jpg)

Look at the photos and think about:

* What do you see?
* Can you see any new design opportunities?
* What problems can you see?
* How could you make use of the LEGO bricks, the EV3 Programmable Brick, motors, and sensors?

### Things You’ll Need

* [@boardname@ Core Set](https://education.lego.com/enus/products/legomindstormseducationev3coreset/5003400)

Additional materials to add to your Sound Machine:

* Small musical instruments, such as chimes, bells, and small drums
* Arts and crafts materials such as:
>* Cardboard
>* Construction paper
>* Pipe cleaners
>* Plastic or paper cups 
>* Recycled materials
>* Rubber bands
>* Wire

### Prior Knowledge

This activity uses motor rotations and sensor inputs. You may want to try the [Use](/getting-started/use) or [Object Detection](/coding/object-detection) activity before this one. Or, you can start out with this activity and tinker with coding motor and sensor inputs on your own.

## Contemplate

Follow the steps of the _Maker Design Process_ for this lesson:

* Define the Problem
* Brainstorming
* Define the Design Criteria
* Go Make
* Review and Revise Your Solution
* Communicate Your Solution

### Defining the Problem

1. What problems did you imagine? 
2. Pick one problem and explain it to a partner.

### Brainstorm

Now that you have defined a problem, start to generate ideas for solving it. 

### ~hint

Some things to do while brainstorming:

* Use the bricks from the LEGO set to help you brainstorm or sketch your ideas on paper.
* The goal of brainstorming is to explore as many solutions as possible. You can use the tinkering examples in the Sample Solutions section below as inspiration for getting started.
* Share your ideas and get some feedback. It may lead to more ideas!

### ~

### Define the Design Criteria

* You should have generated a number of ideas. Now select the best one to make. 
* Write out two or three specific design criteria your design must meet.

### Go Make

It is time to start making!

* Use the components from the @boardname@ Core Set and additional materials to make your chosen solution. 
* Test and analyze your design as you go and record any improvements that you make. 

### Review and Revise Your Solution

* Have you managed to solve the problem that you defined? 
* Look back at your design criteria. How well does your solution work? 
* How can you improve your design?

### Communicate Your Solution

Now that you have finished you can:
* Make a sketch or take a photo or video of your model.
* Label the three most important parts and explain how they work.
* Share your work with others.

## Continue

### Rhythm Maker - Sample Solution

This example program combined with the small model will make a beat and rhythm on any surface when the program is run.

![Sound Machine Tinkering Example](/static/lessons/make-a-sound-machine/lego-maker-sound-machine.jpg)

#### Programming

1. Drag a run ``||motors:large motor A||`` block inside the ``||loops:forever||`` loop.
2. Press the **(+)**.
3. Change the rotations to `2`.
4. Drag a ``||loops:pause||`` block and place it under the motor block.
5. Change the duration to ``200`` ms.
6. Drag a ``||run large motor A||`` block inside the ``||loops:forever||`` loop.
7. Press the **(+)**.
8. Change the power to `100`.
9. Change the rotations to `1`.

```blocks
forever(function () {
    motors.largeA.run(50, 2, MoveUnit.Rotations)
    pause(200)
    motors.largeA.run(100, 1, MoveUnit.Rotations)
})
```

Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the ``center`` button on the EV3 Brick to run the program.

### Color Sensor Sounds - Sample Solution

You can also tinker with the use of sensors.

![Sound Machine Color Sensor](/static/lessons/make-a-sound-machine/lego-maker-sound-machine-color-sensor.jpg)

#### Programming

1. Drag an ``||logic:if else||`` Logic block and place it inside the ``||loops:forever||`` loop.
2. Drag a ``||sensors:pause color sensor||`` block and place it inside the ``||logic:if true then||`` block.
3. Change the color to ``blue``.
4. Drag a ``||music:play tone||`` block and place under the sensor block.
5. Change the tone to ``Middle G`` (392 Hz).
6. Drag a ``||sensors:pause color sensor||`` block and place it inside the ``||logic:else||`` block.
7. Change the color to ``red``.
8. Drag a ``||music:play tone||`` block and place under the new sensor block.
9. Change the tone to ``High C`` (523 Hz).
10. Press the **(+)**.
11. Drag a ``||sensors:pause color sensor||`` block and place it inside the ``||logic:else if||`` block.
12. Change the color to ``green``.
13. Drag a ``||music:play tone||`` block and place under the new sensor block.
14. Change the tone to ``High D`` (587 Hz).

```blocks
forever(function () {
    if (true) {
        sensors.color3.pauseUntilColorDetected(ColorSensorColor.Blue)
        music.playTone(392, music.beat(BeatFraction.Whole))
    } else if (false) {
        sensors.color3.pauseUntilColorDetected(ColorSensorColor.Red)
        music.playTone(523, music.beat(BeatFraction.Half))
    } else {
        sensors.color3.pauseUntilColorDetected(ColorSensorColor.Green)
        music.playTone(587, music.beat(BeatFraction.Half))
    }
})
```

Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the ``center`` button on the EV3 Brick to run the program.
