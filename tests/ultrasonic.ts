tests.test("Ultrasonic sensor", function () {
    brick.print("Place object ", 0, 50)
    brick.print("one finger's length", 0, 60)
    brick.print("in front of sensor", 0, 70)
    brick.print("and click enter", 0, 80)
    brick.buttonEnter.pauseUntil(ButtonEvent.Bumped)
    brick.clearScreen()
    tests.assertClose("Distance", sensors.ultrasonic1.distance(), 7, 6)
})