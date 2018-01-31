# Brick

## Screen

```cards
brick.showMood(moods.sleeping);
brick.showImage(images.expressionsBigSmile);
brick.showString("Hello world!", 1);
brick.showNumber(0, 1);
brick.showValue("item", 0, 1);
brick.clearScreen();
brick.printPorts();
```

## Buttons

```cards
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {

});
brick.buttonEnter.pauseUntil(ButtonEvent.Bumped);
brick.buttonEnter.isPressed()
brick.buttonEnter.wasPressed()
brick.setLight(BrickLight.Red);
```

## Other

```cards
brick.batteryLevel()
```
