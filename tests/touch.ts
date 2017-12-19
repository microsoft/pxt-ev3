tests.test("Touch sensor pressed", function () {
    brick.print("Press touch sensor", 0, 50)
    brick.print("and click enter", 0, 60)
    brick.buttonEnter.pauseUntil(ButtonEvent.Click)
    brick.clearScreen()
    tests.assert("Pressed", sensors.touchSensor1.isPressed())
})