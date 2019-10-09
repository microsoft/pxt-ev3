# stop Program

Stops the program and returns to the brick menu

```sig
brick.stopProgram();
```

## Example

Do a sequence of motor commands and stop the program.

```blocks
motors.largeA.run(50)
pause(500)
motors.stopAll()
brick.stopProgram();
```