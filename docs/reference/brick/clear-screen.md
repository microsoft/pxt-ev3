# clear Screen

Clear any text or numbers displayed on the screen. The screen will be blank.

```sig
brick.clearScreen();
```

## Example

Clear the screen after displaying the message.

```blocks
brick.showString("This message will", 1);
brick.showString("self-destruct in:", 2);
brick.showString("seconds", 5);
for (let i = 0; i < 10; i++) {
    brick.showNumber(10 - i, 4);
    pause(1000);
}
brick.clearScreen();
```
