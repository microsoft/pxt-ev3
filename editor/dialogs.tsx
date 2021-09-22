import * as React from "react";
import { canUseWebSerial, enableWebSerialAsync } from "./deploy";
import { projectView } from "./extension";

let confirmAsync: (options: any) => Promise<number>;

export function bluetoothTryAgainAsync(): Promise<void> {
    return confirmAsync({
        header: lf("Bluetooth download failed..."),
        jsx: <ul>
            <li>{lf("Make sure to stop your program or exit portview on the EV3.")}</li>
            <li>{lf("Check your battery level.")}</li>
            <li>{lf("Close EV3 LabView or other MakeCode editor tabs.")}</li>
        </ul>,
        hasCloseIcon: false,
        hideCancel: true,
        hideAgree: false,
        agreeLbl: lf("Try again")
    }).then(r => {});
}

function enableWebSerialAndCompileAsync() {
    return enableWebSerialAsync()
        .then(() => pxt.U.delay(500))
        .then(() => projectView.compile());
}

let bluetoothDialogShown = false;
function explainWebSerialPairingAsync(): Promise<void> {
    if (!confirmAsync || bluetoothDialogShown) return Promise.resolve();

    bluetoothDialogShown = true;
    return confirmAsync({
        header: lf("Bluetooth pairing"),
        hasCloseIcon: false,
        hideCancel: true,
        buttons: [{
            label: lf("Help"),
            icon: "question circle",
            className: "lightgrey",
            url: "/bluetooth"
        }],
        jsx: <p>
            {lf("You will be prompted to select a serial port.")}
            {pxt.BrowserUtils.isWindows()
                ? lf("Look for 'Standard Serial over Bluetooth link'.")
                : lf("Loop for 'cu.EV3-SerialPort'.")}
            {lf("If you have paired multiple EV3, you might have to try out multiple ports until you find the correct one.")}
        </p>
    }).then(() => { })
}

export function showUploadDialogAsync(fn: string, url: string, _confirmAsync: (options: any) => Promise<number>): Promise<void> {
    confirmAsync = _confirmAsync;
    // https://msdn.microsoft.com/en-us/library/cc848897.aspx
    // "For security reasons, data URIs are restricted to downloaded resources.
    // Data URIs cannot be used for navigation, for scripting, or to populate frame or iframe elements"
    const downloadAgain = !pxt.BrowserUtils.isIE() && !pxt.BrowserUtils.isEdge();
    const docUrl = pxt.appTarget.appTheme.usbDocs;

    const jsx =
        <div className="ui grid stackable">
            <div className="column five wide" style={{ backgroundColor: "#E2E2E2" }}>
                <div className="ui header">{lf("First time here?")}</div>
                <strong style={{ fontSize: "small" }}>{lf("You must have version 1.10E or above of the firmware")}</strong>
                <div style={{ justifyContent: "center", display: "flex", padding: "1rem" }}>
                    <img className="ui image" src="/static/download/firmware.png" style={{ height: "100px" }} />
                </div>
                <a href="/troubleshoot" target="_blank">{lf("Check your firmware version here and update if needed")}</a>
            </div>
            <div className="column eleven wide">
                <div className="ui grid">
                    <div className="row">
                        <div className="column">
                            <div className="ui two column grid padded">
                                <div className="column">
                                    <div className="ui">
                                        <div className="image">
                                            <img className="ui medium rounded image" src="/static/download/connect.svg" style={{ height: "109px", width: "261px", marginBottom: "1rem" }} />
                                        </div>
                                        <div className="content">
                                            <div className="description">
                                                <span className="ui yellow circular label">1</span>
                                                <strong>{lf("Connect the EV3 to your computer with a USB cable")}</strong>
                                                <br />
                                                <span style={{ fontSize: "small" }}>{lf("Use the miniUSB port on the top of the EV3 Brick")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="ui">
                                        <div className="image">
                                            <img className="ui medium rounded image" src="/static/download/transfer.svg" style={{ height: "109px", width: "261px", marginBottom: "1rem" }} />
                                        </div>
                                        <div className="content">
                                            <div className="description">
                                                <span className="ui yellow circular label">2</span>
                                                <strong>{lf("Move the .uf2 file to the EV3 Brick")}</strong>
                                                <br />
                                                <span style={{ fontSize: "small" }}>{lf("Locate the downloaded .uf2 file and drag it to the EV3 USB drive")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>;

    return confirmAsync({
        header: lf("Download to your EV3"),
        jsx,
        hasCloseIcon: true,
        hideCancel: true,
        hideAgree: false,
        agreeLbl: lf("I got it"),
        className: 'downloaddialog',
        buttons: [canUseWebSerial() ? {
            label: lf("Bluetooth"),
            icon: "bluetooth",
            className: "bluetooth focused",
            onclick: () => {
                pxt.tickEvent("bluetooth.enable");
                explainWebSerialPairingAsync()
                    .then(() => enableWebSerialAndCompileAsync())
            }
        } : undefined, downloadAgain ? {
            label: fn,
            icon: "download",
            className: "lightgrey focused",
            url,
            fileName: fn
        } : undefined, docUrl ? {
            label: lf("Help"),
            icon: "help",
            className: "lightgrey",
            url: docUrl
        } : undefined]
        //timeout: 20000
    }).then(() => { });
}