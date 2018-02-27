# @extends

## Example #example

Send a 'code red' error that you created to the error display if the brick crashes into a wall.

```blocks
let codeRed = 1
let codeBlue = 2
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    control.panic(codeRed)	
})
```