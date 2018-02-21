# Sensors

# Color

```cards
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () {});
sensors.color1.color();
sensors.color1.light();
sensors.color1.pauseForColor(null)
sensors.color1.pauseForLight(LightIntensityMode.Reflected, LightCondition.Dark)
sensors.color()
```

## Touch

```cards
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {})
sensors.touch1.pauseUntil(ButtonEvent.Pressed)
sensors.touch1.wasPressed()
sensors.touch1.isPressed()
```

## Gyro

```cards
sensors.gyro1.angle();
sensors.gyro1.rate();
sensors.gyro1.reset();
```

## Ultrasonic

```cards
sensors.ultrasonic4.onEvent(UltrasonicSensorEvent.ObjectDetected, function () {});
sensors.ultrasonic1.distance();
sensors.ultrasonic1.pauseUntil(UltrasonicSensorEvent.ObjectDetected);
```

## Infrared

```cards
sensors.infraredSensor1.onEvent(null, function () {});
sensors.infraredSensor1.pauseUntil(null);
sensors.infraredSensor1.proximity();

```
