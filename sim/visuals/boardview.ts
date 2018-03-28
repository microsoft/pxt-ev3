namespace pxsim.visuals {
    mkBoardView = (opts: BoardViewOptions): BoardView => {
        return new visuals.EV3View({
            runtime: runtime,
            theme: visuals.randomTheme(opts.highContrast, opts.light),
            disableTilt: false,
            wireframe: opts.wireframe,
        });
    }
}