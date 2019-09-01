# run

Set the rotation speed of the motor as a percentage of maximum speed.

```sig
motors.largeA.run(50)
```

The speed setting is a percentage of the motor's full speed. Full speed is the speed that the motor runs when the brick supplies maximum output voltage to the port.

If you use just the **speed** number, the motor runs continuously and won't stop unless you tell it to. You can also give a value for a certain amount of distance you want the motor to rotate for. The **value** can be an amount of time, a turn angle in degrees, or a number of full rotations.

If you decide to use a **value** of rotation distance, you need to choose a type of movement **unit**.

## ~hint

If you use a number of milliseconds as movement units, then you don't need to include the unit type.

To run the motor for 500 milliseconds:

```block
motors.largeA.run(50, 500)
```

## ~

Here is how you use each different movement unit to run the motor for a fixed rotation distance.

```blocks
// Run motor for 700 Milliseconds. 
motors.largeA.run(25, 700, MoveUnit.MilliSeconds);

// Run motors B and C for 700 Milliseconds again but no units specified. 
motors.largeBC.run(25, 700);

// Run the motor for 45 seconds
motors.largeA.run(50, 45, MoveUnit.Seconds);

// Turn the motor for 270 degrees
motors.largeA.run(50, 270, MoveUnit.Degrees)

// Turn the motor at full speed for 9 full rotations
motors.largeA.run(100, 9, MoveUnit.Rotations);
```

## Parameters

* **speed**: a [number](/types/number) that is the percentage of full speed. A negative value runs the motor in the reverse direction.
* **value**: the [number](/types/number) of movement units to rotate for. A value of `0` means run the motor continuously.
* **unit**: the movement unit of rotation. This can be `milliseconds`, `seconds`, `degrees`, or `rotations`. If the number for **value** is `0`, this parameter isn't used.

## ~hint

** Reverse is negative speed**

Turning the motor in the opposite direction (reverse) is simple. Reverse is just a negative speed setting. To drive the motor in reverse at 25% speed:

```block
motors.largeB.run(-25)
```

## ~

## Multiple motors

When using **run** with multiple motors, there is no guarantee that their speed will stay in sync. Use [tank](/reference/motors/tank) or [steer](/reference/motors/steer) for synchronized motor operations.

```blocks
motors.largeBC.run(50)
```

## Examples

### Drive the motor for 20 seconds

Run the motor connected to port **A** continuously. Pause 20 seconds and then stop the motor.

```blocks
motors.largeA.run(75)
pause(20000)
motors.largeA.stop()
```

### Backwards motion

Run the motor connected to port **A** in reverse. Pause 5 seconds and then stop the motor.

```blocks
motors.largeA.run(-60)
pause(5000)
motors.largeA.stop()
```

### Run the motor for 35 rotations

Run the motor connected to port **B** for 35 full rotations and then stop.

```blocks
motors.largeB.run(50, 35, MoveUnit.Rotations)
```

## See also

[tank](/reference/motors/synced/tank), [steer](/reference/motors/synced/steer), [stop](/reference/motors/motor/stop)