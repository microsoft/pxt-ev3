

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
        private id = Math.random().toString();

        getInnerView() {
            this.group = svg.elt("g") as SVGGElement;
            this.group.setAttribute("transform", `scale(0.25, 0.25)`)
            
            const xml = pxsim.visuals.normalizeXml(this.id, pxsim.visuals.REMOVE_SVG);
            const content = svg.parseString(xml);
            this.group.appendChild(content);

            const btns: Map<InfraredRemoteButton> = {
                "center": InfraredRemoteButton.CenterBeacon,
                "topleft": InfraredRemoteButton.TopLeft,
                "topright": InfraredRemoteButton.TopRight,
                "bottomleft": InfraredRemoteButton.BottomLeft,
                "bottomright": InfraredRemoteButton.BottomRight
            }

            Object.keys(btns).forEach(bid => {
                const cid = btns[bid];
                const bel = content.getElementById(pxsim.visuals.normalizeId(this.id, bid));
                bel.className += " sim-button";
                pointerEvents.down.forEach(evid => bel.addEventListener(evid, ev => {
                    ev3board().remoteState.setPressed(cid, true);
                }));
                bel.addEventListener(pointerEvents.leave, ev => {
                    ev3board().remoteState.setPressed(cid, false);
                });
                bel.addEventListener(pointerEvents.up, ev => {
                    ev3board().remoteState.setPressed(cid, false);
                });
            });
            return this.group;
        }

        getInnerWidth() {
            return 98.3;
        }

        getInnerHeight() {
            return 110.8;
        }
    }
}