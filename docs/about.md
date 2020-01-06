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

The editor works in [most modern browsers](/browsers). It works [offline](/offline) once loaded and doesn't require any installation. Take a look at some of the [features](/about/editor-features) of the editor.

### ~ hint

#### Using LEGO® MINDSTORMS® Education NXT

The MakeCode editor works with @boardname@. To create code for LEGO® MINDSTORMS® Education NXT, you need to [download](https://education.lego.com/downloads/retiredproducts/nxt/software) the software to program it.

### ~

## Compile and Flash: Your Program!

When you have your code ready, you connect your EV3 Brick to a computer with a USB cable so it appears as an attached drive (named **@drivename@**). 

Compilation to machine code from [Blocks](/blocks) or [JavaScript](/javascript) happens in the browser. You save the binary 
program to a **.uf2** file, which you then copy to the **@drivename@** drive. The process of copying will flash the device with the new program.

### ~ hint

#### Bluetooth support

**Experimental support** for Bluetooth download is now available. Please read the [Bluetooth](/bluetooth) page for more information.

### ~

## Simulator: Test Your Code

You can run your code using the @boardname@ simulator, all inside the same browser window. 
The simulator has support for the EV3 Brick screen, buttons, sensors, and motors.

```sim
brick.buttonEnter.onEvent(ButtonEvent.Bumped, () => {
    motors.largeA.run(50)
    motors.mediumD.run(50)
    sensors.touch1.pauseUntil(ButtonEvent.Pressed)
    sensors.ultrasonic4.pauseUntil(UltrasonicSensorEvent.ObjectDetected)
})
```