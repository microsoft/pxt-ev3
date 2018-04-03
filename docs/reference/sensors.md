# Sensors

# Color

```cards
sensors.color1.onColorDetected(ColorSensorColor.Blue, function () {})
sensors.color1.onLightDetected(LightIntensityMode.Reflected, Light.Dark, function () {})
sensors.color1.pauseUntilLightDetected(LightIntensityMode.Reflected, Light.Dark)
sensors.color1.pauseUntilColorDetected(ColorSensorColor.Blue)
sensors.color1.color();
sensors.color1.light(LightIntensityMode.Ambient)
sensors.color(ColorSensorColor.Blue)
```

## Touch

```cards
sensors.touch1.onEvent(ButtonEvent.Pressed, function () {})
sensors.touch1.pauseUntil(ButtonEvent.Pressed)
sensors.touch1.isPressed()
sensors.touch1.wasPressed()
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
sensors.infrared1.onEvent(null, function () {});
sensors.infrared1.pauseUntil(null);
sensors.infrared1.proximity();

```

## Infrared beacon button

```cards
sensors.remoteButtonCenter.onEvent(ButtonEvent.Pressed, function () {})
sensors.remoteButtonCenter.pauseUntil(ButtonEvent.Pressed);
sensors.remoteButtonCenter.isPressed()
sensors.remoteButtonCenter.wasPressed()
sensors.infrared1.setRemoteChannel(null)
```
