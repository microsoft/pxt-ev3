# Happy unhappy

Use a touch sensor to make the brick happy.

```blocks
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {
    brick.showImage(images.expressionsBigSmile)
})
sensors.touch1.onEvent(ButtonEvent.Released, function () {
    brick.showImage(images.expressionsSick)
})
```