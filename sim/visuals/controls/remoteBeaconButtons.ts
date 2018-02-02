

namespace pxsim.visuals {
    enum InfraredRemoteButton {
        CenterBeacon = 0x01,
        TopLeft = 0x02,
        BottomLeft = 0x04,
        TopRight = 0x08,
        BottomRight = 0x10,
    }

    export class RemoteBeaconButtonsControl extends ControlView<InfraredSensorNode> {
        private group: SVGGElement;
                
        getInnerView() {
            this.group = svg.elt("g") as SVGGElement;
            this.group.setAttribute("transform", `translate(2, 2.5) scale(0.6)`)

            const btnIds = [
                InfraredRemoteButton.CenterBeacon, 
                InfraredRemoteButton.TopLeft, 
                InfraredRemoteButton.TopRight,
                InfraredRemoteButton.BottomLeft,
                InfraredRemoteButton.BottomRight];
            const colors = ['#f12a21', '#ffd01b', '#006db3', '#00934b', '#6c2d00'];

            let cy = -4;
            btnIds.forEach((cid, c) => {
                const cx = c % 2 == 0 ? 2.2 : 8.2;
                if (c % 2 == 0) cy += 5;
                if (btnIds[c]) {
                    const circle = pxsim.svg.child(this.group, "circle", { 'class': 'sim-color-grid-circle', 'cx': cx, 'cy': cy, 'r': '2', 'style': `fill: ${colors[c]}` });
                    pointerEvents.down.forEach(evid => circle.addEventListener(evid, ev => {
                        ev3board().remoteState.setPressed(cid, true);
                    }));
                    circle.addEventListener(pointerEvents.leave, ev => {
                        ev3board().remoteState.setPressed(cid, false);
                    });
                    circle.addEventListener(pointerEvents.up, ev => {
                        ev3board().remoteState.setPressed(cid, false);
                    });
                }

            })

            return this.group;
        }

        getInnerWidth() {
            return 10.2;
        }

        getInnerHeight() {
            return 15;
        }
    }
}