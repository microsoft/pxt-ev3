// EV3 specific test functions
tests.onEvent(TestEvent.RunSetUp, function() {
    console.sendToScreen();
})
tests.onEvent(TestEvent.TestSetUp, function() {
    motors.stopAll();
    motors.resetAll();
})
tests.onEvent(TestEvent.TestTearDown, function() {
    motors.stopAll();
    motors.resetAll();
})
