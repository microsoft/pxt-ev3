namespace pxsim.visuals {
    mkBoardView = (opts: BoardViewOptions): BoardView => {
        return new visuals.EV3View({
            runtime: runtime,
            theme: visuals.randomTheme(),
            disableTilt: false,
            wireframe: opts.wireframe,
        });
    }
}