screen.clear()
brick.print("PXT!", 10, 30, Draw.Quad)

brick.drawRect(40, 40, 20, 10, Draw.Fill)
brick.setLight(LightsPattern.Orange)

brick.heart.doubled().draw(100, 50, Draw.Double | Draw.Transparent)

brick.buttonEnter.onEvent(ButtonEvent.Click, () => {
    screen.clear()
})

brick.buttonLeft.onEvent(ButtonEvent.Click, () => {
    brick.drawRect(10, 70, 20, 10, Draw.Fill)
    brick.setLight(LightsPattern.Red)
    brick.setFont(brick.microbitFont())
})

brick.buttonRight.onEvent(ButtonEvent.Click, () => {
    brick.print("Right!", 10, 60)
})

brick.buttonDown.onEvent(ButtonEvent.Click, () => {
    brick.print("Down! ", 10, 60)
})

brick.buttonUp.onEvent(ButtonEvent.Click, () => {
    brick.print("Up!  ", 10, 60)
})


let num = 0

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
