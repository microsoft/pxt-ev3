screen.clear()
screen.print("PXT!", 10, 30, Draw.Quad)

screen.drawRect(40, 40, 20, 10, Draw.Fill)
output.setStatusLight(LightsPattern.Orange)

screen.drawIcon(100, 50, screen.doubleIcon(screen.heart), Draw.Double | Draw.Transparent)

input.buttonEnter.onEvent(ButtonEvent.Click, () => {
    screen.clear()
})

input.buttonLeft.onEvent(ButtonEvent.Click, () => {
    screen.drawRect(10, 70, 20, 10, Draw.Fill)
    output.setStatusLight(LightsPattern.Red)
    screen.setFont(screen.microbitFont())
})

input.buttonRight.onEvent(ButtonEvent.Click, () => {
    screen.print("Right!", 10, 60)
})

input.buttonDown.onEvent(ButtonEvent.Click, () => {
    screen.print("Down! ", 10, 60)
})

input.buttonUp.onEvent(ButtonEvent.Click, () => {
    screen.print("Up!  ", 10, 60)
})


let num = 0

input.touchSensor1.onEvent(TouchSensorEvent.Bumped, () => {
    screen.print("Click!  " + num, 10, 60)
    num++
})

input.remoteTopLeft.onEvent(ButtonEvent.Click, () => {
    screen.print("TOPLEFT " + num, 10, 60)
    num++
})

input.remoteTopRight.onEvent(ButtonEvent.Down, () => {
    screen.print("TOPRIGH " + num, 10, 60)
    num++
})

loops.forever(() => {
    serial.writeDmesg()
    loops.pause(100)
})

/*
loops.forever(() => {
    let v = input.color.getColor()
    screen.print(10, 60, v + "   ")
    loops.pause(200)
})
*/
