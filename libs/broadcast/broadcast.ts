/**
 * Message broadcasting
 */
//% weight=70
//% color="#00ac00"
namespace broadcast {
    const broadcastEventId = control.allocateNotifyEvent();
    const broadcastDoneEventId = control.allocateNotifyEvent();

    function normalizeId(id: number) {
        // upper ids are reserved for answer
        return ((id + 1) | 0) & 0xffff;
    }

    /**
     * An enum shim
     */
    //% shim=ENUM_GET
    //% blockId=msg_enum_shim
    //% block="$arg"
    //% enumName="Messages"
    //% enumMemberName="message"
    //% enumPromptHint="e.g. Move, Turn, ..."
    //% enumInitialMembers="message1"
    //% blockHidden=1
    //% enumIsHash=1
    export function __messageShim(arg: number) {
        // This function should do nothing, but must take in a single
        // argument of type number and return a number value.
        return arg;
    }

    /**
     * Register code to run when a message is received
     */
    //% block="on %id=msg_enum_shim|received"
    //% blockId=broadcastonreceived draggableParameters
    export function onMessageReceived(message: number, body: () => void) {
        const messageid = normalizeId(message);
        control.onEvent(broadcastEventId, messageid, function () {
            body();
            control.raiseEvent(broadcastDoneEventId, messageid);
        })
    }

    /**
     * Sends a message to activate code
     */
    //% block="send %id=msg_enum_shim"
    //% blockId=broadcastsend draggableParameters
    export function sendMessage(message: number) {
        const messageid = normalizeId(message);
        control.raiseEvent(broadcastEventId, messageid);
    }

    /**
     * Sends a message and pauses until the handler to finishes.
     */
    //% block="send %id=msg_enum_shim| and pause"
    //% blockId=broadcastsendpause
    export function sendMessageAndPause(message: number) {
        const messageid = normalizeId(message);
        control.raiseEvent(broadcastEventId, messageid);
        control.waitForEvent(broadcastDoneEventId, messageid);
    }
}