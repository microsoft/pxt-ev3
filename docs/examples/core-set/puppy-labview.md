# Puppy

```typescript
let P_T = 0;
let ISS = 0;
let F_T = 0;
let P_C = 0;
let F_C = 0;
let DB_S = 0;
let NS = false;
let IBP = 0;
let IAP = 0;
let C = false;
let TC = false;
let OTC = false;
let COL = 0;
let OCOL = 0;
let _C = false;
let GTO = 0;

function DN() {
    motors.largeAD.setBrake(true);
    motors.largeAD.tank(50, 50, 1, MoveUnit.Seconds);
    pause(100);
    motors.largeA.clearCounts()
    motors.largeD.clearCounts()
}

function MNRH() {
    motors.mediumC.setBrake(true)
    brick.showImage(images.legoEv3icon)
    brick.setStatusLight(StatusLight.OrangePulse)
    while (!brick.buttonEnter.wasPressed()) {
        if (brick.buttonUp.wasPressed()) {
            motors.mediumC.run(-100);
        } else if (brick.buttonDown.wasPressed()) {
            motors.mediumC.run(100);
        } else {
            motors.mediumC.stop();
        }
    }
    motors.mediumC.stop();
    motors.mediumC.clearCounts();
    brick.setStatusLight(StatusLight.Green);
}

function IS(t: number) {
    ISS = t;
    switch (t) {
        case 0:
            brick.showImage(images.eyesNeutral);
            break;
        case 1:
            brick.showImage(images.eyesSleeping);
            break;
        case 2:
            brick.showImage(images.eyesTear);
            // draw rect...
            break;
        case 3:
            brick.showImage(images.eyesHurt);
            break;
        case 4:
            brick.showImage(images.eyesAngry);
            break;
        case 5:
            brick.showImage(images.eyesTiredMiddle);
            break;
        case 6:
            brick.showImage(images.eyesTiredRight);
            break;
        case 7:
            brick.showImage(images.eyesTiredLeft);
            break;
        case 8:
            brick.showImage(images.eyesLove);
            break;
    }

}

function UP() {
    if (motors.largeA.angle() > -50) {
        control.runInParallel(function () {
            motors.largeD.clearCounts()
            motors.largeD.run(-35);
            pauseUntil(() => motors.largeD.angle() < -25);
            motors.largeD.stop();
            motors.largeD.setRegulated(false)
            motors.largeD.run(-15)
            pauseUntil(() => motors.largeD.angle() < -65);
            motors.largeD.stop();
        })
        motors.largeA.clearCounts()
        motors.largeA.run(-35);
        pauseUntil(() => motors.largeA.angle() < -25);
        motors.largeA.stop();
        motors.largeA.setRegulated(false)
        motors.largeA.run(-15)
        pauseUntil(() => motors.largeA.angle() < -65);
        motors.largeA.stop();

        pause(500);
    }
}

function RST() {
    P_T = Math.randomRange(3, 6);
    F_T = Math.randomRange(2, 4);
    P_C = 1;
    F_C = 1;
    control.timer1.reset();
    control.timer2.reset();
    control.timer3.reset();
    CS(0);
}

function CS(db: number) {
    if (DB_S != db) {
        DB_S = db;
        NS = true;
    }
}

function MON() {
    if (control.timer2.seconds() > 10) {
        control.timer2.reset();
        P_C--;
        if (P_C < 0) {
            P_C = 0;
        }
    }
    if (control.timer1.seconds() > 20) {
        control.timer1.reset()
        F_C--;
        if (F_C < 0) {
            F_C = 0;
        }
    }
    if (control.timer3.seconds() > 30) {
        control.timer3.reset();
        CS(1);
    }
}

function UIS() {
    if (control.timer5.seconds() > IBP) {
        control.timer5.reset();
        if (ISS == 1) {
            ISS = 6;
            IBP = Math.randomRange(1, 5);
        } else {
            ISS = 1;
            IBP = 0.25;
        }
        IS(ISS);
    }
    if (control.timer6.seconds() > IAP) {
        if (ISS != 1) {
            control.timer6.reset();
            IAP = Math.randomRange(1, 10)
            if (ISS != 7) {
                ISS = 7
            } else {
                ISS = 6;
            }
            IS(ISS);
        }
    }
}

function UPDB() {
    if ((P_T == P_C) && (F_T == F_C)) {
        CS(6);
    }
    if ((P_T > P_C) && (F_T < F_C)) {
        CS(3);
    }
    if ((P_T < P_C) && (F_T > F_C)) {
        CS(5);
    }
    if ((P_C == 0) && (F_C > 0)) {
        CS(2)
    }
    if (F_C == 0) {
        CS(4)
    }
}

function PTC() {
    C = false;
    OTC = TC;
    TC = sensors.touch1.isPressed()
    if (TC != OTC && TC) {
        P_C++;
        control.timer3.reset();
        if (DB_S != 4) {
            IS(2);
            music.playSoundEffect(sounds.animalsDogSniff);
            C = true;
        }
    }
    return C;
}

function FDC() {
    OCOL = COL;
    COL = sensors.color4.color();
    _C = false;
    if ((COL != 0) && (OCOL != COL)) {
        F_C++;
        _C = true;
        control.timer3.reset();
        IS(2);
        music.playSoundEffect(sounds.expressionsCrunching)
    }
    return _C;
}

function IDL() {
    if (NS) {
        NS = false;
        UP();
    }
    UIS();
    UPDB();
    PTC();
    FDC();
}

function MHT(Pos: number) {
    let _R = Pos - motors.mediumC.angle();
    if (_R >= 0) {
        motors.mediumC.run(100, _R, MoveUnit.Degrees);
    } else {
        motors.mediumC.run(-100, Math.abs(_R), MoveUnit.Degrees);
    }
}

function SLP() {
    if (NS) {
        NS = false;
        IS(5)
        DN()
        MHT(3000)
        IS(1)
        music.playSoundEffect(sounds.expressionsSnoring)
    }
    if (sensors.touch1.isPressed() || brick.buttonEnter.isPressed()) {
        music.stopAllSounds();
        control.timer3.reset();
        CS(7);
    }
}

function PLF() {
    if (NS) {
        NS = false
        IS(0)
        UP()
        music.playSoundEffect(sounds.animalsDogBark2)
        control.timer4.reset()
        GTO = Math.randomRange(4, 8);
    }
    if(PTC()) {
        CS(0);
    }
    if (control.timer4.seconds() > GTO) {
        music.playSoundEffect(sounds.animalsDogBark2)
        control.timer4.reset();
        GTO = Math.randomRange(4, 8);
    }
}

function NGR() {
    NS = false
    IS(4)
    music.playSoundEffect(sounds.animalsDogGrowl);
    UP();
    pause(1500);
    music.stopAllSounds()
    music.playSoundEffect(sounds.animalsDogBark1)
    P_C--;
    CS(0);
}

function HNG() {
    if (NS) {
        NS = false;
        IS(3)
        DN();
        music.playSoundEffect(sounds.animalsDogWhine);        
    }
    if(FDC()) {
        CS(0)
    }
    if (PTC()) {
        CS(3);
    }
}

function PPP() {
    NS = false;
    IS(2);
    UP();
    pause(100)
    motors.largeA.run(-30, 70, MoveUnit.Degrees);
    pause(800);
    music.playSoundEffect(sounds.mechanicalHorn1);
    pause(1000);
    for(let i = 0; i < 3; ++i) {
        motors.largeA.run(-30, 20, MoveUnit.Degrees);
        motors.largeA.run(30, 20, MoveUnit.Degrees);
    }
    motors.largeA.run(30, 70, MoveUnit.Degrees);
    F_C = 1;
    CS(0);
}

function HPY() {
    IS(8)
    MHT(0);
    motors.largeAD.run(10, 0.8, MoveUnit.Seconds);
    for(let i = 0; i < 3; ++i) {
        music.playSoundEffect(sounds.animalsDogBark1);
        motors.largeAD.run(-100, 0.2, MoveUnit.Seconds);
        pause(300)
        motors.largeAD.run(10, 0.3, MoveUnit.Seconds)
    }
    pause(500);
    music.stopAllSounds();
    DN();
    RST();
}

function STL() {
    UP();
    motors.largeAD.run(-20, 60, MoveUnit.Degrees);
    music.playSoundEffect(sounds.animalsDogWhine);
    motors.largeAD.run(20, 60, MoveUnit.Degrees);
}

function WKU() {
    let stateC = false;
    IS(5);
    music.playSoundEffect(sounds.animalsDogWhine)
    MHT(0)
    DN()
    STL()
    pause(1000);
    UP()
    CS(0;)
}

DN();
MNRH();
// compare button state???
IS(1);
UP();
RST();
forever(function () {
    MON();
    switch (DB_S) {
        case 0:
            IDL();
            break;
        case 1:
            SLP();
            break;
        case 2:
            PLF();
            break;
        case 3:
            NGR();
            break;
        case 4:
            HNG();
            break;
        case 5:
            PPP();
            break;
        case 6:
            HPY();
            break;
        case 7:
            WKU();
            break;
    }
})
```
