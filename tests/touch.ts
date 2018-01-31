tests.test("Touch sensor pressed", function () {
    brick.print("Press touch sensor", 0, 50)
    brick.print("and click enter", 0, 60)
    brick.buttonEnter.pauseUntil(ButtonEvent.Bumped)
    brick.clearScreen()
    tests.assert("Pressed", sensors.touch1.isPressed())
})