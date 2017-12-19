tests.test("Detect color red", function () {
    brick.print("Point sensor to red", 0, 50)
    brick.print("and click enter", 0, 60)
    brick.buttonEnter.pauseUntil(ButtonEvent.Click)
    brick.clearScreen()
    let actualColor = sensors.color1.color()
    tests.assertClose("Color", actualColor, ColorSensorColor.Red, 0)
})

tests.test("Bright ambient light", function () {
    brick.print("Point sensor to ceiling", 0, 50)
    brick.print("light and click enter", 0, 60)
    brick.buttonEnter.pauseUntil(ButtonEvent.Click)
    brick.clearScreen()
    let actualLight: number
    for (let i = 0; i < 4; i++) {
        actualLight = sensors.color1.ambientLight()
        loops.pause(500)
    }
    tests.assertClose("Light", actualLight, 20, 15)
})

tests.test("Bright reflected light", function () {
    brick.print("Point sensor to white", 0, 50)
    brick.print("desk surface", 0, 60)
    brick.print("and click enter", 0, 70)
    brick.buttonEnter.pauseUntil(ButtonEvent.Click)
    brick.clearScreen()
    let actualLight: number
    for (let i = 0; i < 4; i++) {
        actualLight = sensors.color1.reflectedLight()
        loops.pause(500)
    }
    tests.assertClose("Light", actualLight, 17, 14)
})