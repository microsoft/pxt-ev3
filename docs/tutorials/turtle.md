# Turtle

A fun interactive program where the user enters a sequence of moves using the buttons and the robot executes it.


```blocks
/**
* Run this program with a driving base.
**/
let indent = ""
let command = ""
let c = ""
brick.buttonLeft.onEvent(ButtonEvent.Pressed, function () {
    command = command + "L"
})
brick.buttonRight.onEvent(ButtonEvent.Pressed, function () {
    command = command + "R"
})
brick.buttonUp.onEvent(ButtonEvent.Pressed, function () {
    command = command + "F"
})
brick.buttonDown.onEvent(ButtonEvent.Pressed, function () {
    command = command + "B"
})
brick.buttonEnter.onEvent(ButtonEvent.Pressed, function () {
    indent = ""
    for (let index = 0; index <= command.length; index++) {
        c = command[index]
        brick.showString("" + indent + c, 4)
        indent = "" + indent + " "
        if (c == "L") {
            motors.largeBC.steer(-100, 50, 378, MoveUnit.Degrees)
        } else if (c == "R") {
            motors.largeBC.steer(100, 50, 378, MoveUnit.Degrees)
        } else if (c == "F") {
            motors.largeBC.steer(0, 50, 1, MoveUnit.Rotations)
        } else if (c == "B") {
            motors.largeBC.steer(0, -50, 1, MoveUnit.Rotations)
        }
    }
    command = ""
    brick.showString("", 2)
})
motors.largeBC.setBrake(true)
forever(function () {
    brick.showString("TURTLE", 1)
    brick.showString(command, 3)
    brick.showString("up/down: forward/backward", 8)
    brick.showString("left/right: turn", 9)
    brick.showString("enter: play commands", 10)
})
```