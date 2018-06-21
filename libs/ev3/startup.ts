// This is the last thing executed before user code

// pulse green, play startup sound, turn off light
brick.setStatusLight(StatusLight.GreenPulse);
// We pause for 100ms to give time to read sensor values, so they work in on_start block
pause(400)
// and we're ready
brick.setStatusLight(StatusLight.Off);
