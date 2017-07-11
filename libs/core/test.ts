screen.clear()
screen.drawText(10, 30, "Welcome PXT!", Draw.Double)

screen.drawRect(40, 40, 20, 10, Draw.Fill)
output.setLights(LightsPattern.Orange)

screen.drawIcon(100, 50, screen.doubleIcon(screen.heart), Draw.Double|Draw.Transparent)

input.buttonEnter.onEvent(ButtonEvent.Click, () => {
    screen.clear()
})

input.buttonLeft.onEvent(ButtonEvent.Click, () => {
    screen.drawRect(10, 70, 20, 10, Draw.Fill)
    output.setLights(LightsPattern.Red)
    screen.setFont(screen.microbitFont())
})

input.buttonRight.onEvent(ButtonEvent.Click, () => {
    screen.drawText(10, 60, "Right!")
})

input.buttonDown.onEvent(ButtonEvent.Click, () => {
    screen.drawText(10, 60, "Down! ")
})

input.buttonUp.onEvent(ButtonEvent.Click, () => {
    screen.drawText(10, 60, "Up!  ")
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