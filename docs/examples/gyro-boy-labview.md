# Gyro Boy LabView

```blocks
let mSum = 0;
let mPos = 0;
let mSpd = 0;
let mD = 0;
let mDP1 = 0;
let mDP2 = 0;
let mDP3 = 0;
let Crdv = 0;
let cLo = 0;
let gAng = 0;
let ok = false;
let pwr = 0;
let Cstr = 0;
let Cdrv = 0;
let gMn = 0;
let gMx = 0;
let gSum = 0;
let gyro = 0;
let gOS = 0;
let gSpd = 0;
let tInt = 0.014;
let lpwr = 0
let rpwr = 0
let tStart = 0
let st = 0
let oldDr = 0

function RST() {
    motors.largeA.reset()
    motors.largeD.reset()
    motors.largeA.setRegulated(false)
    motors.largeD.setRegulated(false)
    sensors.gyro2.reset()
    sensors.gyro2.rate()
    control.timer2.reset()
    pause(5000)
    mSum = 0;
    mPos = 0;
    mD = 0;
    mDP1 = 0;
    mDP2 = 0;
    mDP3 = 0;
    Crdv = 0;
    cLo = 0;
    gAng = 0;
    ok = false;
    pwr = 0;
    st = 0;
    Cstr = 0;
    Cdrv = 0;
}

function OS() {
    // OSL
    do {
        gMn = 1000;
        gMx = -100;
        gSum = 0;
        // gChk
        for (let i = 0; i < 200; i++) {
            gyro = sensors.gyro2.rate()
            gSum = gyro;
            gMx = Math.max(gMx, gyro)
            gMn = Math.min(gMn, gyro)
            pause(4);
        }
    } while (gMx - gMn > 2);
    gOS = gSum / 200;
}

function GT() {
    if (cLo == 0) {
        tInt = 0.014;
        control.timer1.reset();
    } else {
        tInt = control.timer1.seconds() / cLo;
    }
    cLo++;
}

function GG() {
    gyro = sensors.gyro2.rate();
    gOS = 0.0005 * gyro + (1 - 0.0005) * gOS
    gSpd = gyro - gOS;
    gAng = gAng + tInt * gSpd;
}

function GM() {
    let temp = mSum
    mSum = motors.largeD.angle() + motors.largeA.angle();
    mD = mSum - temp;
    mPos = mPos + mD;
    mSpd = ((mDP1 + mDP2 + mDP3 + mD) / 4) / tInt;
    mDP3 = mDP2;
    mDP2 = mDP1;
    mDP1 = mD;
}

function EQ() {
    mPos = mPos - Cdrv * tInt;
    pwr = (0.8 * gSpd + 15 * gAng) + (0.095 * mSpd + 0.13 * mPos) - 0.01 * Cdrv
    if (pwr > 100) pwr = 100
    else if (pwr < -100) pwr = -100
}

function cntrl() {
    mPos = mPos - tInt * Cdrv
    lpwr = (pwr + Cstr * 0.1)
    rpwr = (pwr - Cstr * 0.1)
}

function CHK() {
    if (Math.abs(pwr) < 100)
        control.timer2.reset();
    if (control.timer2.seconds() > 2) {
        ok = true;
    }
}

// M
forever(function () {
    RST();
    brick.showImage(images.eyesSleeping)
    OS()
    gAng = -0.25;
    music.playSoundEffect(sounds.movementsSpeedUp)
    brick.showImage(images.eyesAwake)
    st = 1;
    // BALANCE
    while (!ok) {
        GT();
        let t1 = control.timer1.millis()
        GG();
        GM();
        EQ();
        cntrl();
        motors.largeA.run(lpwr)
        motors.largeD.run(rpwr)
        CHK()
        let t2 = control.timer1.millis();
        let p = 5 - (t2 - t1);
        pause(Math.max(1, p))
    }
    motors.stopAll()
    st = 0;
    brick.setStatusLight(StatusLight.RedPulse);
    brick.showImage(images.eyesKnockedOut)
    music.playSoundEffect(sounds.movementsSpeedDown)
    sensors.touch3.pauseUntil(ButtonEvent.Pressed)
    brick.setStatusLight(StatusLight.Off);
})

// BHV
forever(function () {
    switch (st) {
        case 0:
            Cdrv = 0;
            Cstr = 0;
            break;
        case 1:
            Cdrv = 40;
            pause(4000);
            Cdrv = 0;
            music.playTone(1000, 100);
            st = 2;
            break;
        case 2:
            switch (sensors.color1.color()) {
                case ColorSensorColor.Red:
                    music.playTone(2000, 100);
                    Cdrv = 0;
                    Cstr = 0;
                    break;
                case ColorSensorColor.Green:
                    music.playTone(2000, 100);
                    Cdrv = 150;
                    Cstr = 0;
                    break;
                case ColorSensorColor.Blue:
                    music.playTone(2000, 100);
                    Cstr = 70;
                    break;
                case ColorSensorColor.Yellow:
                    music.playTone(2000, 100);
                    Cstr = -70;
                    break;
                case ColorSensorColor.White:
                    music.playTone(2000, 100);
                    Cdrv = -75;
                    break;
            }
            if (sensors.ultrasonic4.distance() < 25) {
                Cstr = 0;
                oldDr = Cdrv;
                Cdrv = -10;
                motors.mediumC.run(30, 30, MoveUnit.Degrees);
                motors.mediumC.run(-30, 60, MoveUnit.Degrees);
                motors.mediumC.run(30, 30, MoveUnit.Degrees);
                if (Math.randomRange(-1, 1) >= 1)
                    Cstr = 70;
                else
                    Cstr = -70;
                pause(4000);
                music.playTone(2000, 100)
                Cstr = 0;
                Cdrv = oldDr;
            }
            break;
    }
    pause(80);
})
```