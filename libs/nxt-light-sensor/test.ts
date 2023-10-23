forever(function () {
    control.timer1.reset();
    let rrnls1 = sensors.nxtLight1._readPin1();
    let rrnls2 = sensors.nxtLight1._readPin6();
    let rrnls3 = sensors.nxtLight1.reflectetLightRaw();
    let rrlcs = sensors.color2.light(LightIntensityMode.ReflectedRaw);
    let rrrcs = sensors.color3.light(LightIntensityMode.ReflectedRaw);
    let t = sensors.touch4.isPressed() ? 1 : 0;
    brick.clearScreen();
    brick.printValue("rrnls1", rrnls1, 1);
    brick.printValue("rrnls2", rrnls2, 2);
    brick.printValue("rrnls3", rrnls3, 3);
    brick.printValue("rrlcs", rrlcs, 4);
    brick.printValue("rrrcs", rrrcs, 5);
    brick.printValue("t", t, 6);
    brick.printValue("active1", sensors.nxtLight1.isActive() ? 1 : 0, 11);
    brick.printValue("active2", sensors.touch4.isActive() ? 1 : 0, 12);
    control.timer1.pauseUntil(10);
})