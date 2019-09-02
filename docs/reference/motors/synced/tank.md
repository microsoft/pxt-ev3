# tank

Rotate two motors in synchronization.

```sig
motors.largeAB.tank(50, 50)
```

Tanking the brick will drive two motors in synchronization. This means that both motors will start at the same time. Also, each motor uses the same amount of rotation when running at the same speed. You can use different speed values for each motor to perform turns or spins.

## Speed and distance

The speed setting is a pecentage of the motor's full speed. Full speed is the speed that the motors run when the brick supplies maximum output voltage to the port.

If you use just the **speed** number, the motors run continously and won't stop unless you tell them to. You can also give a value for a certain amount of distance you want the motors to rotate for. The **value** can be an amount of time, a turn angle in degrees, or a number of full rotations.

If you decide to use a **value** of rotation distance, you need to choose a type of movement **unit**. Also, if you use a number of milliseconds as movement units, then you don't need to include the unit type. The description in [run](/reference/motors/motor/run) shows how to use different movement units.

## Parameters

* **speedLeft**: a [number](/types/number) that is the percentage of full speed for the motor attached to the left of the brick. A negative value runs the motor in the reverse direction.
* **speedRight**: a [number](/types/number) that is the percentage of full speed for the motor attached to the right of the brick. A negative value runs the motor in the reverse direction.
* **value**: the [number](/types/number) of movement units to rotate for. A value of `0` means run the motor continuously.
* **unit**: the movement unit of rotation. This can be `milliseconds`, `seconds`, `degrees`, or `rotations`. If the number for **value** is `0`, this parameter isn't used.

## ~hint

** Reverse is negative speed**

Tankng the brick in the opposite direction (reverse) is simple. Reverse is just a negative speed setting. To drive the motors in reverse at 75% speed:

```block
motors.largeBC.tank(-75, -75)
```

## ~

## ~ hint

Only one set of synchronized motors will run at the same time. Once you launch tank/steer, it will cancel any existing synchronized speed command.

## ~

## Examples

### Tank forward and backward

Move the brick straight ahead and then go backward.

```blocks
motors.largeAB.tank(75, 75)
pause(10000)
motors.largeAB.tank(-55, -55)
pause(10000)
motors.stopAll()
```

### Slip steer

Run the right motor at 50% and let the left motor spin freely.

```blocks
motors.largeAB.tank(0, 50)
```

### Skid steer

Set the brake on the right motor. Run the left motor at 60% and let the right motor skid.

```blocks
motors.largeB.setBrake(true)
motors.largeAB.tank(60, 0)
```

### Spin around

Run both motors in opposite directions to spin the brick around to the left.

```blocks
motors.largeAB.tank(-30, 30)
pause(5000)
motors.stopAll()
```

### Tank tester

This program lets you change the tank values using the brick buttons.

```typescript
let tankB = 0;
let tankC = 0;

brick.showString(`tank tester`, 1)
brick.showString(`connect motors BC`, 7)
brick.showString(`up/down for tank B`, 8)
brick.showString(`left/right for tank C`, 9)

forever(function () {
    brick.showString(`motor B speed ${motors.largeB.speed()}%`, 4)
    brick.showString(`motor C speed ${motors.largeC.speed()}%`, 5)
    pause(100)
})

function updateTank() {
    brick.showString(`tank A: ${tankB}%`, 2)
    brick.showString(`tank B: ${tankC}%`, 3)
    motors.largeBC.tank(tankB, tankC);
}

brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    tankB += 10
    updateTank();
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    tankB -= 10
    updateTank();
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    tankC += 10
    updateTank();
})
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    tankC -= 10
    updateTank();
})

updateTank();
```

## See also

[steer](/reference/motors/synced/steer), [run](/reference/motors/motor/run)