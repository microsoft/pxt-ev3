# Spin Turn

A **spin turn** happens when a [EV3 Driving Base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf) turns, or rotates, on a single spot by spinning both wheels, but with each turning in opposite directions.

You can make a turn happen with either a ``||motors:tank||`` or a ``||motors:steer||`` block.

```blocks
forever(function() {
    motors.largeBC.tank(50, -50, 2, MoveUnit.Rotations)
    motors.largeBC.tank(-50, 50, 2, MoveUnit.Rotations)
})
```