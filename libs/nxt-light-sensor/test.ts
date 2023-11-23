sensors.nxtLight1.setReflectedLightRange(2600, 1600);

forever(function () {
    control.timer1.reset();
    let nls1 = sensors.nxtLight1.reflectetLightRaw();
    let nls2 = sensors.nxtLight1.light(NXTLightIntensityMode.ReflectedRaw);
    let rrlcs = sensors.color2.light(LightIntensityMode.ReflectedRaw);
    let rrrcs = sensors.color3.light(LightIntensityMode.ReflectedRaw);
    let t = sensors.touch4.isPressed() ? 1 : 0;
    brick.clearScreen();
    brick.printValue("nls1", nls1, 1);
    brick.printValue("nls2", nls2, 2);
    brick.printValue("rrlcs", rrlcs, 3);
    brick.printValue("rrrcs", rrrcs, 4);
    brick.printValue("t", t, 5);
    brick.printValue("active1", sensors.nxtLight1.isActive() ? 1 : 0, 11);
    brick.printValue("active4", sensors.touch4.isActive() ? 1 : 0, 12);
    control.timer1.pauseUntil(10);
})