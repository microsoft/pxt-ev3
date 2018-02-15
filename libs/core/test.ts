screen.clear()
brick.print("PXT!", 10, 30, Draw.Quad)

brick.drawRect(40, 40, 20, 10, Draw.Fill)
brick.setStatusLight(StatusLight.Orange)

brick.heart.doubled().draw(100, 50, Draw.Double | Draw.Transparent)

brick.buttonEnter.onEvent(ButtonEvent.Bumped, () => {
    screen.clear()
})

brick.buttonLeft.onEvent(ButtonEvent.Bumped, () => {
    brick.drawRect(10, 70, 20, 10, Draw.Fill)
    brick.setStatusLight(StatusLight.Red)
    brick.setFont(brick.microbitFont())
})

brick.buttonRight.onEvent(ButtonEvent.Bumped, () => {
    brick.print("Right!", 10, 60)
})

brick.buttonDown.onEvent(ButtonEvent.Bumped, () => {
    brick.print("Down! ", 10, 60)
})

brick.buttonUp.onEvent(ButtonEvent.Bumped, () => {
    brick.print("Up!  ", 10, 60)
})


let num = 0

forever(() => {
    serial.writeDmesg()
    pause(100)
})

/*
forever(() => {
    let v = input.color.getColor()
    screen.print(10, 60, v + "   ")
    pause(200)
})
*/
