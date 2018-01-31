# show String

Show some text on a the screen at the line you select.

```sig
brick.showString("Hello world", 1)
```

## Parameters

* **text**: a [string](/types/string) to show on the brick's screen.
* **line**: the line [number](/types/number) on the screen where the text is displayed. The line numbers for the screen start with line `1`.

## Example

Show a greeting on the screen. Then, respond with another message when ENTER is pressed.

```blocks
brick.showString("Hello, I dare you to", 1);
brick.showString("press ENTER...", 2);
brick.buttonEnter.onEvent(ButtonEvent.Bumped, function () {
	brick.showString("Hey! Don't push my", 4);
	brick.showString("buttons.", 5);
});
```

## See also

[show number](/reference/brick/show-number)