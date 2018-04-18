# send To Screen

Direct the console output to go to the @boardname@ screen.

```sig
console.sendToScreen();
```

A "console" is a place for a user to see special messages from a device. It could be  something connected to a serial port, a display that shows text, or even a text file. A console is typically used as a place to send information that is added to a message _log_ (a record of messages that are sent from a device). Your program can send log messages using the [console](/reference/console) functions. The MakeCode editor has a console view that lets you see the console output when your program runs in the simulator.

On the EV3 Brick, the screen can serve as a console too and you can make your console output go there. Before using the console log functions, set the screen as the console output location.

## Example

Direct the console output to go to the screen. Show 20 values on the screen. Use the up and down buttons to scroll through the values.

```blocks
console.sendToScreen()
for (let index = 0; index <= 20; index++) {
    console.logValue("index", index)
}
```

## See also

[log](reference/console/log), [log value](/reference/console/log-value)