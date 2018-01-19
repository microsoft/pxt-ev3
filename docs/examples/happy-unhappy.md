# Happy unhappy

Use a touch sensor to make the brick happy.

```blocks
sensors.touch1.onEvent(TouchSensorEvent.Pressed, function () {
    brick.showImage(images.expressionsBigSmile)
})
sensors.touch1.onEvent(TouchSensorEvent.Released, function () {
    brick.showImage(images.expressionsSick)
})
```