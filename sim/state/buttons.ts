namespace pxsim {

    export class EV3ButtonState extends CommonButtonState{

        constructor() {
            super();
            this.buttons = [
                new CommonButton(DAL.BUTTON_ID_UP),
                new CommonButton(DAL.BUTTON_ID_ENTER),
                new CommonButton(DAL.BUTTON_ID_DOWN),
                new CommonButton(DAL.BUTTON_ID_RIGHT),
                new CommonButton(DAL.BUTTON_ID_LEFT),
                new CommonButton(DAL.BUTTON_ID_ESCAPE),
                new CommonButton(DAL.BUTTON_ID_ALL)
            ];
        }
    }
}