#ifndef __PXT_EV3CONST_H
#define __PXT_EV3CONST_H

#define NUM_INPUTS 4
#define NUM_OUTPUTS 4
#define LCD_WIDTH 178
#define LCD_HEIGHT 128
#define NUM_BUTTONS 6

#define DEVICE_TYPE_NXT_TOUCH 1
#define DEVICE_TYPE_NXT_LIGHT 2
#define DEVICE_TYPE_NXT_SOUND 3
#define DEVICE_TYPE_NXT_COLOR 4
#define DEVICE_TYPE_TACHO 7
#define DEVICE_TYPE_MINITACHO 8
#define DEVICE_TYPE_NEWTACHO 9
#define DEVICE_TYPE_TOUCH 16
#define DEVICE_TYPE_COLOR 29
#define DEVICE_TYPE_ULTRASONIC 30
#define DEVICE_TYPE_GYRO 32
#define DEVICE_TYPE_IR 33
#define DEVICE_TYPE_THIRD_PARTY_START 50
#define DEVICE_TYPE_THIRD_PARTY_END 99
#define DEVICE_TYPE_IIC_UNKNOWN 100
#define DEVICE_TYPE_NXT_TEST 101
#define DEVICE_TYPE_NXT_IIC 123
#define DEVICE_TYPE_TERMINAL 124
#define DEVICE_TYPE_UNKNOWN 125
#define DEVICE_TYPE_NONE 126
#define DEVICE_TYPE_ERROR 127

#define MAX_DEVICE_DATALENGTH 32
#define MAX_DEVICE_MODES 8

#define UART_BUFFER_SIZE 64
#define TYPE_NAME_LENGTH 11
#define SYMBOL_LENGTH 4

#define DEVICE_LOGBUF_SIZE 300

#define IIC_NAME_LENGTH 8

#define CONN_UNKNOWN 111
#define CONN_DAISYCHAIN 117
#define CONN_NXT_COLOR 118
#define CONN_NXT_DUMB 119
#define CONN_NXT_IIC 120
#define CONN_INPUT_DUMB 121
#define CONN_INPUT_UART 122
#define CONN_OUTPUT_DUMB 123
#define CONN_OUTPUT_INTELLIGENT 124
#define CONN_OUTPUT_TACHO 125
#define CONN_NONE 126
#define CONN_ERROR 127

#define opProgramStart 0x03
#define opOutputGetType 0xA0
#define opOutputSetType 0xA1
#define opOutputReset 0xA2
#define opOutputStop 0xA3
#define opOutputPower 0xA4
#define opOutputSpeed 0xA5
#define opOutputStart 0xA6
#define opOutputPolarity 0xA7
#define opOutputRead 0xA8
#define opOutputTest 0xA9
#define opOutputReady 0xAA
#define opOutputPosition 0xAB
#define opOutputStepPower 0xAC
#define opOutputTimePower 0xAD
#define opOutputStepSpeed 0xAE
#define opOutputTimeSpeed 0xAF
#define opOutputStepSync 0xB0
#define opOutputTimeSync 0xB1
#define opOutputClearCount 0xB2
#define opOutputGetCount 0xB3
#define opOutputProgramStop 0xB4

#define BUTTON_ID_UP 0x01
#define BUTTON_ID_ENTER 0x02
#define BUTTON_ID_DOWN 0x04
#define BUTTON_ID_RIGHT 0x08
#define BUTTON_ID_LEFT 0x10
#define BUTTON_ID_ESCAPE 0x20

#endif