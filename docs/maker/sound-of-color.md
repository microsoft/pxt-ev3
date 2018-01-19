# Sound Of Color

This program will play different sounds when the wheel is rotated. The sound is determined by which color is placed in front of the color Sensor.

```blocks
sensors.color3.onColorDetected(ColorSensorColor.Blue, function () {
    music.playTone(Note.G4, music.beat(BeatFraction.Half))
})
sensors.color3.onColorDetected(ColorSensorColor.Red, function () {
    music.playTone(Note.C5, music.beat(BeatFraction.Half))
})
sensors.color3.onColorDetected(ColorSensorColor.Green, function () {
    music.playTone(Note.D5, music.beat(BeatFraction.Half))
})
```