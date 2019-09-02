# Smooth Turn

A **smooth turn** happens when a [EV3 Driving Base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf) makes a turn by spinning both both wheels but with each running at a different speed.

You can make a turn happen with either a ``||motors:tank||`` or a ``||motors:steer||`` block.

```blocks
forever(function() {
    motors.largeBC.tank(50, 20, 2, MoveUnit.Rotations)
    motors.largeBC.tank(20, 50, 2, MoveUnit.Rotations)
})
```