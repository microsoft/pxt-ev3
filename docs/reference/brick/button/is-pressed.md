# is Pressed

Check if a button is being pressed or not.

```sig
brick.buttonEnter.isPressed()
```

## ~hint

**Touch sensors**

Your @boardname@ has touch sensors that work like buttons. Instead of saying `enter` or `left` as the source button, use a touch sensor block with a sensor name like `touch 1`.

```block
if (sensors.touch1.isPressed()) {
    console.log("Hey, I feel pressed.");
}
```

Read about [touch sensors](/reference/sensors/touch-sensor) and using them as touch buttons.

## ~

## Returns

* a [boolean](types/boolean): `true` if the button is pressed, `false` if the button is not pressed

## Example

Set the brick light to green when the `down` is pressed. When the button is not pressed, the brick light is red.

```blocks
let isRed = false;
forever(function() {
    if (brick.buttonLeft.isPressed()) {
        brick.setStatusLight(StatusLight.Green);
        isRed = false;
    } else {
        if (!isRed) {
            brick.setStatusLight(StatusLight.Red);
            isRed = true;
        }
    }
})
```

## See also

[was pressed](/reference/brick/button/was-pressed),
[on event](/reference/brick/button/on-event)

[Touch sensors](/reference/sensors/touch-sensor)