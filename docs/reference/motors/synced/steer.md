# steer

Steer the brick in one direction using a turn ratio between two motors.

```sig
motors.largeAB.steer(0, 0)
```

A brick driving with two motors can steer itself by changing the speed of one motor compared to the speed of the other. To make a slow turn to the left, you might make the right motor run slightly faster than the left one. To make a fast, or sharp, turn to the right, the left motor could run at least twice as fast as the right one.

The EV3 Brick steers by using a percentage value of _follow_ for one of the motors. This means that the motor in the turn direction will rotate slower than the other. It is the _follower_ motor and the other motor is the _drive_ motor. The drive motor runs at a percentage of full speed set in **speed**. The follower motor runs at a percentage of speed of the drive motor. So, it runs at a percentage of a percentage of full speed.

To make the turn happen you give a _turn ratio_ which is a percentage value of steer to the left or right. If you want to steer to the left at 30% of the of the drive motor speed, use the value of `-30` for **turnRatio**. Left turns use negative values and right turns use positive values. A really sharp turn to the right might use a turn ratio value of `80`.

## Speed and distance

The speed setting is a pecentage of the motor's full speed. Full speed is the speed that the motors run when the brick supplies maximum output voltage to the port.

If you use just the **speed** number, the motors run continously and won't stop unless you tell them to. You can also give a value for a certain amount of distance you want the motors to rotate for. The **value** can be an amount of time, a turn angle in degrees, or a number of full rotations.

If you decide to use a **value** of rotation distance, you need to choose a type of movement **unit**. Also, if you use a number of milliseconds as movement units, then you don't need to include the unit type. The description in [run](/reference/motors/motor/run) shows how to use different movement units.

## Parameters

* **turnRatio**: a [number](/types/number) that is the percentage of speed of the drive motor. The follower motor runs at this speed. A negative number steers to the left and a positive number steers to the right. This is a number between `-200` and `200`.
* **speed**: a [number](/types/number) that is the percentage of full speed. A negative value runs the motors in the reverse direction. This is the speed that the drive motor runs at.
* **value**: the [number](/types/number) of movement units to rotate for. A value of `0` means run the motor continuously.
* **unit**: the movement unit of rotation. This can be `milliseconds`, `seconds`, `degrees`, or `rotations`. If the number for **value** is `0`, this parameter isn't used.

## ~hint

** Reverse is negative speed**

Steering the brick backwards (in reverse) is simple. Reverse is just a negative speed setting. To steer the brick to the left in reverse at 75% speed:

```block
motors.largeBC.steer(-15, -75)
```

## ~

## ~ hint

Only one set of synchronized motors will run at the same time. Once you launch tank/steer, it will cancel any existing synchronized speed command.

## ~


## Examples

### Make a slight right

Turn to the right with a turn ratio of 10%.

```block
motors.largeBC.steer(10, 55)
```

### Make a sharp left

Turn sharply to the left.

```block
motors.largeBC.steer(-80, 40)
```

### Steer straight

Use **steer** but go straight ahead.

```block
motors.largeBC.steer(0, 100)
```

### Sneaky snake

Steer the brick in a snake pattern for a short time.

```block
for (let i = 0; i < 4; i++) {
    motors.largeBC.steer(30, 30)
    pause(5000)
    motors.largeBC.steer(-30, 30)
    pause(5000)
}
motors.stopAll()
```

### Steer tester

This program lets you change the values of speed and turn ratio with the buttons.

```typescript
let speed = 0;
let turnRatio = 0;

brick.showString(`steer tester`, 1)
brick.showString(`connect motors BC`, 7)
brick.showString(`up/down for speed`, 8)
brick.showString(`left/right for turn ratio`, 9)

forever(function () {
    brick.showString(`motor B speed ${motors.largeB.speed()}%`, 4)
    brick.showString(`motor C speed ${motors.largeC.speed()}%`, 5)
    pause(100)
})

function updateSteer() {
    motors.largeBC.steer(turnRatio, speed);
    brick.showString(`speed ${speed}%`, 2)
    brick.showString(`turnRatio ${turnRatio}`, 3)
}

brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    speed += 10
    updateSteer()
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    speed -= 10
    updateSteer()
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    turnRatio -= 10
    updateSteer()
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    turnRatio += 10
    updateSteer()
})

updateSteer()
```

## See also

[tank](/reference/motors/synced/tank), [run](/reference/motors/motor/run)