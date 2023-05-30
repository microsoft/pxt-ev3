namespace music {
    /**
     * Get the frequency of a note.
     * @param note the note name, eg: Note.C
     */
    //% weight=1 help=music/note-frequency
    //% blockId=device_note block="%note"
    //% shim=TD_ID
    //% color="#FFFFFF" colorSecondary="#FFFFFF" colorTertiary="#D67923"
    //% note.fieldEditor="note" note.defl="1046"
    //% note.fieldOptions.editorColour="#D67923" note.fieldOptions.decompileLiterals=true
    //% note.fieldOptions.minNote=40 note.fieldOptions.maxNote=75
    //% useEnumVal=1
    //% weight=10 blockGap=8
    //% group="Tone"
    export function noteFrequency(note: Note): number {
        //TODO fill in actual min/max note values
        return note;
    }
}
