screen.clear()
screen.setFont(ScreenFont.Large)
screen.drawText(10, 30, "Welcome PXT!")

screen.drawEllipse(40, 40, 20, 10, Draw.Fill)
output.setLights(LightsPattern.Orange)

input.buttonEnter.onEvent(ButtonEvent.Click, () => {
    screen.clear()
})

input.buttonLeft.onEvent(ButtonEvent.Click, () => {
    screen.drawRect(10, 70, 20, 10, Draw.Fill)
})

input.buttonRight.onEvent(ButtonEvent.Click, () => {
    screen.setFont(ScreenFont.Normal)
    screen.drawText(10, 60, "Bang!")
})

input.buttonDown.onEvent(ButtonEvent.Click, () => {
    screen.scroll(-10)
})

input.buttonUp.onEvent(ButtonEvent.Click, () => {
    screen.scroll(10)
})


let num = 0

input.touchSensor.onEvent(ButtonEvent.Click, () => {
    screen.drawText(10, 60, "Click!  " + num)
    num++
})

input.remoteTopLeft.onEvent(ButtonEvent.Click, () => {
    screen.drawText(10, 60, "TOPLEFT " + num)
    num++
})

input.remoteTopRight.onEvent(ButtonEvent.Down, () => {
    screen.drawText(10, 60, "TOPRIGH " + num)
    num++
})

loops.forever(() => {
    serial.writeDmesg()
    loops.pause(100)
})

/*
loops.forever(() => {
    let v = input.color.getColor()
    screen.drawText(10, 60, v + "   ")
    loops.pause(200)
})
*/