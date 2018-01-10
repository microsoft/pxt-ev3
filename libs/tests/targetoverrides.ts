// EV3 specific test functions
tests.onEvent(TestEvent.RunSetUp, function() {
    console.sendToScreen();
})
tests.onEvent(TestEvent.TestSetUp, function() {
    motors.stopAllMotors();
    motors.resetAllMotors();
})
tests.onEvent(TestEvent.TestTearDown, function() {
    motors.stopAllMotors();
    motors.resetAllMotors();
})
