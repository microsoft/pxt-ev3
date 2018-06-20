// This is the last thing executed before user code

// We pause for 100ms to give time to read sensor values, so they work in on_start block
pause(100)

// pulse green, play startup sound, turn off light
brick.setStatusLight(StatusLight.GreenPulse);
music.playSoundEffect(sounds.systemStartUp);
brick.showImage(images.eyesAwake, 600);
brick.setStatusLight(StatusLight.Off);
brick.clearScreen();