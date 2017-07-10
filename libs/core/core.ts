namespace core {
    let nextComponentId = 20000;

    export class Component {
        protected _id: number;
        constructor(id = 0) {
            if (!id) id = ++nextComponentId
            this._id = id
        }

        getId() {
            return this._id;
        }
    }
}

const enum LMS {
    NUM_INPUTS = 4,
    LCD_WIDTH = 178,
    LCD_HEIGHT = 128,

    DEVICE_TYPE_NXT_TOUCH = 1,
    DEVICE_TYPE_NXT_LIGHT = 2,
    DEVICE_TYPE_NXT_SOUND = 3,
    DEVICE_TYPE_NXT_COLOR = 4,
    DEVICE_TYPE_TACHO = 7,
    DEVICE_TYPE_MINITACHO = 8,
    DEVICE_TYPE_NEWTACHO = 9,
    DEVICE_TYPE_TOUCH = 16,
    DEVICE_TYPE_THIRD_PARTY_START = 50,
    DEVICE_TYPE_THIRD_PARTY_END = 99,
    DEVICE_TYPE_IIC_UNKNOWN = 100,
    DEVICE_TYPE_NXT_TEST = 101,
    DEVICE_TYPE_NXT_IIC = 123,
    DEVICE_TYPE_TERMINAL = 124,
    DEVICE_TYPE_UNKNOWN = 125,
    DEVICE_TYPE_NONE = 126,
    DEVICE_TYPE_ERROR = 127,
    MAX_DEVICE_DATALENGTH = 32,
    MAX_DEVICE_MODES = 8,
    UART_BUFFER_SIZE = 64,
    TYPE_NAME_LENGTH = 11,
    SYMBOL_LENGTH = 4,
    DEVICE_LOGBUF_SIZE = 300,
    IIC_NAME_LENGTH = 8,
    CONN_UNKNOWN = 111,
    CONN_DAISYCHAIN = 117,
    CONN_NXT_COLOR = 118,
    CONN_NXT_DUMB = 119,
    CONN_NXT_IIC = 120,
    CONN_INPUT_DUMB = 121,
    CONN_INPUT_UART = 122,
    CONN_OUTPUT_DUMB = 123,
    CONN_OUTPUT_INTELLIGENT = 124,
    CONN_OUTPUT_TACHO = 125,
    CONN_NONE = 126,
    CONN_ERROR = 127,
    opOutputGetType = 0xA0,
    opOutputSetType = 0xA1,
    opOutputReset = 0xA2,
    opOutputStop = 0xA3,
    opOutputPower = 0xA4,
    opOutputSpeed = 0xA5,
    opOutputStart = 0xA6,
    opOutputPolarity = 0xA7,
    opOutputRead = 0xA8,
    opOutputTest = 0xA9,
    opOutputReady = 0xAA,
    opOutputPosition = 0xAB,
    opOutputStepPower = 0xAC,
    opOutputTimePower = 0xAD,
    opOutputStepSpeed = 0xAE,
    opOutputTimeSpeed = 0xAF,
    opOutputStepSync = 0xB0,
    opOutputTimeSync = 0xB1,
    opOutputClearCount = 0xB2,
    opOutputGetCount = 0xB3,
    opOutputProgramStop = 0xB4,

    DEVICE_EVT_ANY = 0,
    DEVICE_ID_NOTIFY = 10000,
    DEVICE_ID_NOTIFY_ONE = 10001,
}

