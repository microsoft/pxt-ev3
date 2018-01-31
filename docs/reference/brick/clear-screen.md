# clear Screen

Clear any text or numbers displayed on the screen. The screen will be blank.

```sig
brick.clearScreen();
```

## Example

Clear the screen after displaying the message.

```blocks
brick.showString("This message wil self-destruct in:", 1);
brick.showString("seconds", 3);
for (let i = 0; i < 10; i++) {
    brick.showNumber(10 - i, 2);
}
brick.clearScreen();
```
