# About

Welcome to the **Microsoft MakeCode** editor for the **@boardname@**!

## Programming: [Blocks](/blocks) or [JavaScript](/javascript)

You can program the @boardname@ using [Blocks](/blocks) or [JavaScript](/javascript) in your web browser:

```blocks
brick.buttonEnter.onEvent(ButtonEvent.Bumped, () => {
    motors.largeA.run(50)
})
```
```typescript
brick.buttonEnter.onEvent(ButtonEvent.Bumped, () => {
    motors.largeA.run(50)
})
```

The editor work in [most modern browsers](/browsers), work [offline](/offline) once loaded and do not require any installation. 

## Compile and Flash: Your Program!

When you have your code ready, you connect your @boardname@ to a computer via a USB cable 
so it appears as a mounted drive (named **EV3**). 

Compilation to machine code from [Blocks](/blocks) or [JavaScript](/javascript) happens in the browser. You save the binary 
program to a **.uf2** file, which you then copy to the **EV3** drive, which flashes the device with the new program.

## Simulator: Test Your Code

You can run your code using the micro:bit simulator, all within the confines of a web browser. 
The simulator has support for the LED screen, buttons, as well as compass, accelerometer, and digital I/O pins.

```sim
brick.buttonEnter.onEvent(ButtonEvent.Bumped, () => {
    motors.largeA.run(50)
})
```
