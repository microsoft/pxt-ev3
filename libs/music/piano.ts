namespace music {
    /**
     * Get the frequency of a note.
     * @param name the note name, eg: Note.C
     */
    //% weight=1 help=music/note-frequency
    //% blockId=device_note block="%note"
    //% shim=TD_ID color="#FFFFFF" colorSecondary="#FFFFFF"
    //% note.fieldEditor="note" note.defl="1046"
    //% note.fieldOptions.editorColour="#FF1493" note.fieldOptions.decompileLiterals=true
    //% note.fieldOptions.minNote=52 note.fieldOptions.maxNote=75
    //% useEnumVal=1
    //% weight=10 blockGap=8
    export function noteFrequency(name: Note): number {
        //TODO fill in actual min/max note values
        return name;
    }
}