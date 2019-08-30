# Make It Move Without Wheels

## Objective

Design, build and program a robot that can move itself:

Your robot will:

* Go a distance of at least 30cm
* Use at least one motor
* Use NO wheels for locomotion

![@boardname@ with parts](/static/lessons/make-it-move/locomotion-no-wheels.jpg)

## Construct

Build a Walker Bot!

The Walker Bot is one example of many possible solutions for making a robot move without wheels.

The Walker Bot combines an EV3 Frame and two legs that are mirror-images to create left and right legs.

The legs in the Walker Bot are designed to show how to change the rotary motion of a motor to reciprocating motion.

Start by reading [these](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/ev3-dep/building%20instructions/walker-bot-bi-180fc24f9298e1dd6201099627d43903.pdf) instructions first.

### ~hint

If clicking the above image doesn't open the instructions, right-click on the image and choose "Save link as..." to download the PDF.

### ~

![@boardname@ Walker Bot](/static/lessons/make-it-move/walker-bot.jpg)

 
## Program

In nature, creatures use many methods to get around. None of them, however, use wheels to move. Can we copy the method of animal locomotion with our robot? Using motors and legs, make the robot move without using any wheels.

### Step 1

Place a ``||motors:tank large B+C||`` block from ``||motors:Motors||`` under ``||loops:on start||``.

Change the speed to `-60%` (for motor B) and `+60%` (for motor C).
Change the rotations to `9`.

The ``||motors:tank large B+C||`` block will run for `9` rotations when the **center** button is pressed on the EV3 Brick. The motors are set for the reverse direction because they are mounted upside down in this model.

```blocks
motors.largeBC.tank(-60, 60, 9, MoveUnit.Rotations)
```

### Step 2

Place a ``||motors:stop all motors||`` block under ``||motors:tank large B+C||``.

The ``||motors:tank large B+C||`` block will run for `9` rotations when the **center** button is pressed on the EV3 Brick then stop.

```blocks
motors.largeBC.tank(-60, 60, 9, MoveUnit.Rotations)
motors.largeBC.stop()
```

### Step 3

Place a ``||brick:show string||`` block under ``||motors:stop all motors||``.
Change the `"Hello World"` text to `"30 cm"`.

The ``||motors:tank large B+C||`` will run for `9` rotations when the **center** button is pressed on the EV3 Brick then stop and display "30 cm" on the EV3 Brick’s screen.

```blocks
motors.largeBC.tank(-60, 60, 9, MoveUnit.Rotations)
motors.largeBC.stop()
brick.showString("30 cm", 1)
```

### Step 4

Click `|Download|` and follow the instructions to get your code onto your EV3 Brick. Press the **center** button on the EV3 Brick to run the program.
