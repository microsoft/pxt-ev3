# Pivot Turn

A **pivot turn** happens when a [EV3 Driving Base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf) turns around the wheel on the inside of the turn by spinning just the single wheel at the outside of the turn.

You can make a turn happen with either a ``||motors:tank||`` or a ``||motors:steer||`` block.

```blocks
forever(function() {
    motors.largeBC.tank(50, 0, 2, MoveUnit.Rotations)
    motors.largeBC.tank(0, 50, 2, MoveUnit.Rotations)
})
```