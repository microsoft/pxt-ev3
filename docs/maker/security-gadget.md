
# Make a Security Gadget

Invent a Security Gadget that will protect your belongings by warning you!

![Maker – Make a Security Gadget Main Image](/static/lessons/make-a-security-gadget/lego-maker-security-detect.jpg)

## Connect 

Over time, people have come up with many different ways to help protect their personal belongings from theft. These inventions include simple alarm systems and even traps! 

![Make a Security Gadget 3 Stock Footage Images](/static/lessons/make-a-security-gadget/three-stock.jpg)

Look at the photos and think about:

* What do you see?
* Can you see any new design opportunities?
* What problems can you see?
* How could you make use of the LEGO bricks, the EV3 Programmable Brick, motors, and sensors?

### Things You’ll Need

* [@boardname@ Core Set](https://education.lego.com/enus/products/legomindstormseducationev3coreset/5003400)

Additional materials to add to your Security Gadget:

* String
* Arts and crafts materials such as:
>* Cardboard
>* Construction paper
>* Pipe cleaners
>* Plastic or paper cups 
>* Recycled materials
>* Rubber bands
>* Wire

### Prior Knowledge

This activity uses sensor inputs. You may want to try the [Use](/getting-started/use) or [Object Detection](/coding/object-detection) activity before this one. Or, you can start out with this activity and tinker with coding sensor inputs on your own.

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

1. You should have generated a number of ideas. Now select the best one to make. 
2. Write out two or three specific design criteria your design must meet.

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

### Phone Protector - Sample Solution

This example program combined with the small model will sound an alarm if someone picks it up. The program activates an alarm when an object is lifted from the Touch Sensor.

![Security Gadget Tinkering Example #1 – Phone Stand](/static/lessons/make-a-security-gadget/lego-maker-security-gadget.jpg)

#### Programming

1. Drag a ``||sensors:pause until touch||`` block and place it inside the ``||loops:forever||`` loop.
2. Drag a ``||music:play sound effect||`` block and place it below the ``||sensors:pause until||`` block.
3. Change the sound effect to ``mechanical horn1``.

```blocks
forever(function () {
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    music.playSoundEffect(sounds.mechanicalHorn1)
})
```

Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the ``center`` button on the EV3 Brick to run the program.

### Object Detection - Sample Solution

This example program combined with the small model will sound an alarm if someone (or something) crosses its path! The program activates an alarm when an object moves in front of the Ultrasonic Sensor.

![Security Gadget Tinkering Example #1 – Mouse detector](/static/lessons/make-a-security-gadget/lego-maker-security-detect.jpg)

#### Programming

1. Drag a ``||sensors:pause until ultrasonic||`` block and place it inside the ``||loops:forever||`` loop.
2. Drag a ``||music:play sound effect||`` block and place it below the ``||sensors:pause until||`` block.
3. Change the sound effect to ``mechanical horn1``.

```blocks
forever(function () {
    sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectDetected)
    music.playSoundEffect(sounds.mechanicalHorn1)
})
```

Click **Download** and follow the instructions to get your code onto your EV3 Brick. Press the ``center`` button on the EV3 Brick to run the program.
