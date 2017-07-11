namespace pxsim.visuals {
    mkBoardView = (opts: BoardViewOptions): BoardView => {
        return new visuals.EV3BoardSvg({
            runtime: runtime,
            theme: visuals.randomTheme(),
            disableTilt: false,
            wireframe: opts.wireframe,
        });
    }
}