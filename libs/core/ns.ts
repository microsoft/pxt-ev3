//% color="#00852B" weight=90 icon="\uf10d"
//% groups='["Move", "Counters", "Properties"]'
//% labelLineWidth=50
namespace motors {

    /**
     * A speed picker
     * @param speed the speed, eg: 50
     */
    //% blockId=motorSpeedPicker block="%speed" shim=TD_ID
    //% speed.fieldEditor="speed" colorSecondary="#FFFFFF"
    //% weight=0 blockHidden=1 speed.fieldOptions.decompileLiterals=1
    export function __speedPicker(speed: number): number {
        return speed;
    }

    /**
     * A turn ratio picker
     * @param turnratio the turn ratio, eg: 0
     */
    //% blockId=motorTurnRatioPicker block="%turnratio" shim=TD_ID
    //% turnratio.fieldEditor="turnratio" colorSecondary="#FFFFFF"
    //% weight=0 blockHidden=1 turnRatio.fieldOptions.decompileLiterals=1
    export function __turnRatioPicker(turnratio: number): number {
        return turnratio;
    }
}

//% color="#C8509B" weight=95 icon="\uf10f"
//% labelLineWidth=100
//% groups='["Touch Sensor", "Color Sensor", "Ultrasonic Sensor", "Gyro Sensor", "Infrared Sensor", "Remote Infrared Beacon",  "Light Sensor"]'
//% subcategories='["NXT", "HiTechnic"]'
namespace sensors {
}

//% color="#5F3109" icon="\uf107"
namespace control {
}

//% color="#68C3E2" weight=100 icon="\uf106"
//% groups='["Buttons", "Indicator", "Screen", "Power", "Program"]'
//% labelLineWidth=60
namespace brick {
}