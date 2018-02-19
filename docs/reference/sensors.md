# Sensors

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
