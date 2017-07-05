#include "pxt.h"
#include "ev3.h"
#include <pthread.h>

/**
* User interaction on buttons
*/
enum class ButtonEvent {
    //% block="click"
    Click = 1,
    //% block="long click"
    LongClick = 2,
    //% block="up"
    Up = 3,
    //% block="down"
    Down = 4,
};

/**
 * Patterns for lights under the buttons.
 */
enum class LightsPattern {
    Off = LED_BLACK,
    Green = LED_GREEN,
    Red = LED_RED,
    Orange = LED_ORANGE,
    GreenFlash = LED_GREEN_FLASH,
    RedFlash = LED_RED_FLASH,
    OrangeFlash = LED_ORANGE_FLASH,
    GreenPulse = LED_GREEN_PULSE,
    RedPulse = LED_RED_PULSE,
    OrangePulse = LED_ORANGE_PULSE,
};

namespace pxt {

void *buttonPoll(void *);

class Button {
  public:
    void *ptr;
    int id;
    bool wasPressed;
    bool isPressed;
    int timePressed;
    Button(int ev3id) {
        ptr = 0; // make sure we're not treated as ref-counted object
        id = ev3id;
        wasPressed = false;
        isPressed = false;
        timePressed = 0;
    }
    void raise(ButtonEvent ev) { raiseEvent(ID_BUTTON_BASE + id, (int)ev); }
    void setPressed(bool pr) {
        if (pr == isPressed)
            return;
        isPressed = pr;
        if (isPressed) {
            wasPressed = true;
            timePressed = current_time_ms();
            raise(ButtonEvent::Down);
        } else {
            raise(ButtonEvent::Up);
            auto isLong = current_time_ms() - timePressed > 500;
            raise(isLong ? ButtonEvent::LongClick : ButtonEvent::Click);
        }
    }
};

class WButtons {
  public:
    Button buttons[0];
    //% indexedInstanceNS=input indexedInstanceShim=pxt::getButton
    /**
     * Left button.
     */
    //% block="button left" weight=95
    Button buttonLeft;
    /**
     * Right button.
     */
    //% block="button right" weight=94
    Button buttonRight;
    /**
     * Up button.
     */
    //% block="button up" weight=95
    Button buttonUp;
    /**
     * Down button.
     */
    //% block="button down" weight=95
    Button buttonDown;
    /**
     * Enter button.
     */
    //% block="button enter" weight=95
    Button buttonEnter;

    WButtons()
        : buttonLeft(BUTTON_ID_LEFT), buttonRight(BUTTON_ID_RIGHT), buttonUp(BUTTON_ID_UP),
          buttonDown(BUTTON_ID_DOWN), buttonEnter(BUTTON_ID_ENTER) {
        pthread_t pid;
        pthread_create(&pid, NULL, buttonPoll, this);
        pthread_detach(pid);
    }
};
SINGLETON(WButtons);

const int LastButtonID = (Button *)&((WButtons *)0)->buttonEnter - ((WButtons *)0)->buttons;

extern "C" uint16_t readButtons();

void *buttonPoll(void *arg) {
    auto wb = (WButtons *)arg;
    auto prevState = 0;
    while (true) {
        sleep_core_us(50000);
        auto state = readButtons();
        if (state == prevState)
            continue;
        if (state & BUTTON_ID_ESCAPE)
            exit(0);
        for (int i = 0; i < LastButtonID; ++i) {
            auto btn = &wb->buttons[i];
            btn->setPressed(!!(state & btn->id));
        }
    }
}

//%
Button *getButton(int id) {
    if (!(0 <= id && id <= LastButtonID))
        target_panic(42);
    return &getWButtons()->buttons[id];
}
}

namespace control {

/**
* Determine the version of system software currently running.
*/
//%
String deviceFirmwareVersion() {
    return mkString(HardwareVersionString());
}

}

// TODO rename this? move it somewhere?
namespace output {
/**
 * Set lights.
 */
//% blockId=setLights block="set lights %pattern"
void setLights(LightsPattern pattern) {
    SetLedPattern((uint8_t)pattern);
}
}

//% fixedInstances
namespace ButtonMethods {
/**
 * Do something when a button (`A`, `B` or both `A` + `B`) is clicked, double clicked, etc...
 * @param button the button that needs to be clicked or used
 * @param event the kind of button gesture that needs to be detected
 * @param body code to run when the event is raised
 */
//% help=input/button/on-event weight=99 blockGap=8
//% blockId=buttonEvent block="on %button|%event"
//% parts="buttonpair"
//% blockNamespace=input
//% button.fieldEditor="gridpicker"
//% button.fieldOptions.width=220
//% button.fieldOptions.columns=3
void onEvent(Button_ button, ButtonEvent ev, Action body) {
    registerWithDal(button->id + ID_BUTTON_BASE, (int)ev, body);
}

/**
 * Check if a button is pressed or not.
 * @param button the button to query the request
 */
//% help=input/button/is-pressed weight=79
//% block="%button|is pressed"
//% blockId=buttonIsPressed
//% blockGap=8
//% parts="buttonpair"
//% blockNamespace=input
//% button.fieldEditor="gridpicker"
//% button.fieldOptions.width=220
//% button.fieldOptions.columns=3
bool isPressed(Button_ button) {
    return button->isPressed;
}

/**
 * See if the button was pressed again since the last time you checked.
 * @param button the button to query the request
 */
//% help=input/button/was-pressed weight=78
//% block="%button|was pressed"
//% blockId=buttonWasPressed
//% parts="buttonpair" blockGap=8
//% blockNamespace=input advanced=true
//% button.fieldEditor="gridpicker"
//% button.fieldOptions.width=220
//% button.fieldOptions.columns=3
bool wasPressed(Button_ button) {
    auto res = button->wasPressed;
    button->wasPressed = false;
    return res;
}
}
