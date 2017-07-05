screen.clear()
screen.drawRect(10, 10, 20, 10)
screen.drawText(10, 30, "Hello PXT!")

output.setLights(LightsPattern.GreenFlash)

input.buttonDown.onEvent(ButtonEvent.Click, () => {
    screen.scroll(10)
})

input.buttonUp.onEvent(ButtonEvent.Click, () => {
    screen.scroll(-10)
})

for (let i = 0; i < 3; ++i) {
    loops.forever(() => {
        let r = Math.randomRange(0, 100)
        serial.writeValue("R", r)
        loops.pause(1000)
    })
    loops.pause(300)
}
