const enum ColorSensorMode {
    None = -1,
    Reflect = 0,
    Ambient = 1,
    Color = 2,
    RefRaw = 3,
    RgbRaw = 4,
    ColorCal = 5,
}

const enum ColorSensorColor {
    None,
    Black,
    Blue,
    Green,
    Yellow,
    Red,
    White,
    Brown,
}

namespace input {

    export class ColorSensor extends internal.UartSensor {
        constructor() {
            super()
        }

        _deviceType() {
            return LMS.DEVICE_TYPE_COLOR
        }

        setMode(m: ColorSensorMode) {
            this._setMode(m)
        }

        getAmbientLight() {
            this.setMode(ColorSensorMode.Ambient)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        getReflectedLight() {
            this.setMode(ColorSensorMode.Reflect)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }

        getColor(): ColorSensorColor {
            this.setMode(ColorSensorMode.Color)
            return this.getNumber(NumberFormat.UInt8LE, 0)
        }
    }

    //% whenUsed
    export const color: ColorSensor = new ColorSensor()
}
