# Tank ZigZag

This example shows how to use the [tank](/reference/motors/tank) block to keep the speed of 2 large motors synchronized. The [EV3 Driving Base](https://le-www-live-s.legocdn.com/sc/media/lessons/mindstorms-ev3/building-instructions/ev3-rem-driving-base-79bebfc16bd491186ea9c9069842155e.pdf)
) will move in a zig zag pattern.

```blocks
/**
 * Use the tank block to keep large motors synched. 
 Use this code with a EV3 driving base.
 */
forever(function () {
    brick.showImage(images.eyesMiddleRight)
    motors.largeBC.tank(50, 10, 2, MoveUnit.Rotations)
    brick.showImage(images.eyesMiddleLeft)
    motors.largeBC.tank(10, 50, 2, MoveUnit.Rotations)
})
```