# show Value

Show a name-value-pair on the screen at the line you select.

```sig
brick.showValue("item", 0, 1);
```

Name-value-pairs are used to report data values to the screen. If you want to show the current temperature on the screen, you might use `"temp"` as the data name for the the value.

## Parameters

* **name**: a [string](/types/string) which is the name of the data value.
* **value**: a [number](/types/number) to show on the brick's screen.
* **line**: The line number on the screen where the value is displayed. The line numbers for the screen start with line `1`.

## Example

Show the current amount of ambient light detected by sensor 2.

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
    brick.showValue("color", sensors.color2.light(LightIntensityMode.Ambient), 1)
})
```

## See also

[show number](/reference/brick/show-number)