screen.clear()
screen.setFont(ScreenFont.Large)
screen.drawText(10, 30, "Hello PXT!")

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

for (let i = 0; i < 3; ++i) {
    loops.forever(() => {
        let r = Math.randomRange(0, 100)
        serial.writeValue("R", r)
        //screen.drawText(10, 10, `R=${r}`)
        loops.pause(1000)
    })
    loops.pause(300)
}
